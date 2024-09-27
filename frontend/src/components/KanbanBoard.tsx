import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import KanbanColumn from './KanbanColumn';

interface Candidate {
  id: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

interface KanbanColumnData {
  title: string;
  candidates: Candidate[];
}

interface KanbanBoardProps {
  columns: KanbanColumnData[];
  onCandidateMove: (candidateId: number, newStep: string) => Promise<void>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns: initialColumns, onCandidateMove }) => {
  const [columns, setColumns] = useState(initialColumns);

  const handleDragStart = (e: React.DragEvent, candidateId: number | undefined) => {
    if (candidateId === undefined) {
      console.error('Attempted to drag a candidate with undefined ID');
      return;
    }

    e.dataTransfer.setData('candidateId', candidateId.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLElement>, newStep: string) => {
    e.preventDefault();
    const candidateId = parseInt(e.dataTransfer.getData('candidateId'), 10);

    const updatedColumns = columns.map(column => ({
      ...column,
      candidates: column.candidates.filter(c => c.id !== candidateId)
    }));

    const candidateToMove = columns
      .flatMap(column => column.candidates)
      .find(c => c.id === candidateId);

    if (candidateToMove) {
      const targetColumn = updatedColumns.find(column => column.title === newStep);
      if (targetColumn) {
        targetColumn.candidates.push({ ...candidateToMove, currentInterviewStep: newStep });
      }
    }

    setColumns(updatedColumns);

    try {
      await onCandidateMove(candidateId, newStep);
    } catch (error) {
      console.error('Failed to update candidate stage:', error);
      // Revert the change if the API call fails
      setColumns(columns);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        {columns.map((column, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <KanbanColumn
              key={index}
              title={column.title}
              candidates={column.candidates}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KanbanBoard;