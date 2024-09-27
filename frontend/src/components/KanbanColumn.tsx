import React from 'react';
import { Card } from 'react-bootstrap';
import KanbanCard from './KanbanCard';

interface Candidate {
  name: string;
  score: number;
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
          <KanbanCard key={index} name={candidate.name} score={candidate.score} />
        ))}
      </Card.Body>
    </Card>
  );
};

export default KanbanColumn;
