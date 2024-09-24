import React from 'react';
import { Card } from 'react-bootstrap';
import { useDrag } from 'react-dnd';

type Candidate = {
  id: number;
  applicationId: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
};

type CandidateCardProps = {
  candidate: Candidate;
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CANDIDATE',
    item: candidate,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Card ref={drag} className="mb-2" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card.Body>
        <Card.Title>{candidate.fullName}</Card.Title>
        <Card.Text>Puntuación media: {candidate.averageScore}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CandidateCard;
