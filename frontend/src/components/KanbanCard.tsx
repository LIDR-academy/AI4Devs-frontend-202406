import React from 'react';
import { Card } from 'react-bootstrap';

interface KanbanCardProps {
  id: number;
  name: string;
  score: number;
  onDragStart: (e: React.DragEvent<HTMLElement>, candidateId: number) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ id, name, score, onDragStart }) => {
  return (
    <Card
      className="mb-2 shadow-sm"
      draggable
      onDragStart={(e) => onDragStart(e, id)}
    >
      <Card.Body className="p-2">
        <p className="mb-1 font-weight-bold">{name}</p>
        <div className="d-flex">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`d-inline-block rounded-circle mr-1 ${
                i < score ? 'bg-success' : 'bg-secondary'
              }`}
              style={{ width: '12px', height: '12px' }}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default KanbanCard;
