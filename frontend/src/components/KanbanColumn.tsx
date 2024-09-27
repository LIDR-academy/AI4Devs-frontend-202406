import React from 'react';
import { Card } from 'react-bootstrap';
import KanbanCard from './KanbanCard';

interface Candidate {
  id: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

interface KanbanColumnProps {
  title: string;
  candidates: Candidate[];
  onDragStart: (e: React.DragEvent<HTMLElement>, candidateId: number) => void;
  onDragOver: (e: React.DragEvent<HTMLElement>) => void;
  onDrop: (e: React.DragEvent<HTMLElement>, columnTitle: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, candidates, onDragStart, onDragOver, onDrop }) => {
  return (
    <Card
      className="h-100 shadow-sm"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, title)}
    >
      <Card.Header className="bg-light font-weight-bold text-center">{title}</Card.Header>
      <Card.Body className="p-2">
        {candidates.map((candidate) => (
          <KanbanCard
            key={candidate.id}
            id={candidate.id}
            name={candidate.fullName}
            score={candidate.averageScore}
            onDragStart={onDragStart}
          />
        ))}
      </Card.Body>
    </Card>
  );
};

export default KanbanColumn;
