import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Position } from './Positions';
import KanbanBoard from './KanbanBoard';

type PositionDetailsProps = {
  positions: Position[];
};

interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

interface InterviewFlow {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
}

interface InterviewFlowResponse {
  interviewFlow: {
    positionName: string;
    interviewFlow: InterviewFlow;
  };
}

interface Candidate {
  id: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

const PositionDetails: React.FC<PositionDetailsProps> = ({ positions }) => {
  const { id } = useParams<{ id: string }>();
  const position = positions.find(p => p.id === parseInt(id || ''));
  const [interviewFlow, setInterviewFlow] = useState<InterviewFlow | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!position) return;

      try {
        setLoading(true);
        const [interviewFlowResponse, candidatesResponse] = await Promise.all([
          fetch(`http://localhost:3010/positions/${position.id}/interviewFlow`),
          fetch(`http://localhost:3010/positions/${position.id}/candidates`)
        ]);

        if (!interviewFlowResponse.ok || !candidatesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const interviewFlowData: InterviewFlowResponse = await interviewFlowResponse.json();
        const candidatesData: Candidate[] = await candidatesResponse.json();

        setInterviewFlow(interviewFlowData.interviewFlow.interviewFlow);
        setCandidates(candidatesData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [position]);

  if (!position) {
    return <div>Position not found</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const kanbanData = interviewFlow?.interviewSteps.map(step => ({
    title: step.name,
    candidates: candidates.filter(candidate => candidate.currentInterviewStep === step.name)
  })) || [];

  const handleCandidateMove = async (candidateId: number, newStep: string) => {
    debugger;
    try {
      const response = await fetch(`http://localhost:3010/candidates/${candidateId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: position.id,
          currentInterviewStep: interviewFlow?.interviewSteps.find(step => step.name === newStep)?.id ?? 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate stage');
      }

      const updatedCandidate = await response.json();

      setCandidates(prevCandidates =>
        prevCandidates.map(c =>
          c.id === updatedCandidate.id ? updatedCandidate : c
        )
      );
    } catch (error) {
      console.error('Error updating candidate stage:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Container className="mt-5">
      <Link to="/positions" className="inline-block mb-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition-colors">
        &larr; Back to Positions
      </Link>
      <h2 className="text-center mb-4">{position.title}</h2>
      <KanbanBoard columns={kanbanData} onCandidateMove={handleCandidateMove} />
    </Container>
  );
};

export default PositionDetails;
