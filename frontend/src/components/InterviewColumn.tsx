import React from 'react';
import { Col } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import CandidateCard from './CandidateCard';

type Candidate = {
  id: number;
  applicationId: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
};

type InterviewColumnProps = {
  column: {
    id: number;
    name: string;
    candidates: Candidate[];
  };
  moveCandidate: (candidate: Candidate, toColumnId: number) => void;
};

const InterviewColumn: React.FC<InterviewColumnProps> = ({ column, moveCandidate }) => {
  const [, drop] = useDrop(() => ({
    accept: 'CANDIDATE',
    drop: (item: Candidate) => {
      moveCandidate(item, column.id);
    },
  }));

  return (
    <Col md={4} ref={drop} className="mb-3">
      <h5 className="text-center">{column.name}</h5>
      {column.candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} />
      ))}
    </Col>
  );
};

export default InterviewColumn;
