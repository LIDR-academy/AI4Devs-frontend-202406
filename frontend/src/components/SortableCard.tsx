import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from 'react-bootstrap';
import { Candidate } from '../types/Candidate';

interface SortableCardProps {
  candidate: Candidate;
  index: number;
}

const SortableCard: React.FC<SortableCardProps> = ({ candidate, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2"
    >
      <Card.Body>
        <Card.Title>{candidate.fullName}</Card.Title>
        <div className="d-flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-circle mr-1 ${
                i < candidate.averageScore
                  ? 'bg-success'
                  : 'bg-secondary'
              }`}
              style={{ width: '10px', height: '10px', marginRight: '2px' }}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SortableCard;