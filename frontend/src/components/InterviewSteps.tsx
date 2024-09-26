import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import '../styles/InterviewSteps.css';

interface Candidate {
  id: string;
  fullName: string;
  averageScore: number;
  currentInterviewStep: string;
  currentInterviewStepId: string;
}

interface InterviewStep {
  id: string;
  name: string;
}

const InterviewSteps: React.FC = () => {
  const [interviewSteps, setInterviewSteps] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positionName, setPositionName] = useState('');
  const [loading, setLoading] = useState(true);
  const { positionId } = useParams<{ positionId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [positionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stepsResponse, candidatesResponse] = await Promise.all([
        axios.get(`http://localhost:3010/position/${positionId}/interviewFlow`),
        axios.get(`http://localhost:3010/position/${positionId}/candidates`)
      ]);
      setInterviewSteps(stepsResponse.data.interviewFlow.interviewFlow.interviewSteps);
      setPositionName(stepsResponse.data.interviewFlow.positionName);
      setCandidates(candidatesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const updatedCandidates = candidates.map(candidate => {
        if (candidate.id.toString() === draggableId) {
          return { ...candidate, currentInterviewStepId: destination.droppableId };
        }
        return candidate;
      });

      // Immediately update the state
      setCandidates(updatedCandidates);

      try {
        await axios.put(`http://localhost:3010/candidates/${draggableId}`, {
          applicationId: positionId,
          currentInterviewStep: destination.droppableId
        });
      } catch (error) {
        console.error('Error updating candidate:', error);
        // Revert the change if the API call fails
        setCandidates(candidates);
      }
    }
  };

  const renderCandidateCard = (candidate: Candidate) => (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>{candidate.fullName}</Card.Title>
        <Card.Text>
          {renderScoreCircles(candidate.averageScore)}
        </Card.Text>
      </Card.Body>
    </Card>
  );

  const renderScoreCircles = (score: number) => {
    const fullCircles = Math.floor(score);
    const emptyCircles = 5 - fullCircles;
    return (
      <>
        {[...Array(fullCircles)].map((_, i) => (
          <span key={i} className="score-circle filled">●</span>
        ))}
        {[...Array(emptyCircles)].map((_, i) => (
          <span key={i + fullCircles} className="score-circle">○</span>
        ))}
      </>
    );
  };

  return (
    <Container fluid className="mt-4">
      <h1 className="text-center mb-4">{positionName || 'Loading...'}</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : interviewSteps && interviewSteps.length > 0 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Row className="flex-nowrap overflow-auto">
            {interviewSteps.map(step => (
              <Col key={step.id} xs={12} md={4} lg={3} className="mb-4">
                <Card>
                  <Card.Header>{step.name}</Card.Header>
                  <Card.Body>
                    <Droppable droppableId={step.id.toString()}>
                      {(dropProvided) => (
                        <div key={step.id} {...dropProvided.droppableProps} ref={dropProvided.innerRef} style={{ minHeight: '50px' }}>
                          {candidates
                            .filter(candidate => candidate.currentInterviewStepId.toString() === step.id.toString())
                            .map((candidate, index) => (
                              <Draggable key={candidate.id} draggableId={candidate.id.toString()} index={index}>
                                {(dragProvided) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                  >
                                    {renderCandidateCard(candidate)}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {dropProvided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </DragDropContext>
      ) : (
        <p className="text-center">No interview steps found for this position.</p>
      )}
      <Button variant="secondary" onClick={() => navigate('/positions')} className="mt-4">
        Back to Positions
      </Button>
    </Container>
  );
};

export default InterviewSteps;
