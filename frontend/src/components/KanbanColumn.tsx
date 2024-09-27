import React from 'react';
import { Card } from 'react-bootstrap';
import KanbanCard from './KanbanCard';

interface Candidate {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

interface KanbanColumnProps {
  title: string;
  candidates: Candidate[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, candidates }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-light font-weight-bold text-center">{title}</Card.Header>
      <Card.Body className="p-2">
        {candidates.map((candidate, index) => (
          <KanbanCard key={index} name={candidate.fullName} score={candidate.averageScore} />
        ))}
      </Card.Body>
    </Card>
  );
};

export default KanbanColumn;
