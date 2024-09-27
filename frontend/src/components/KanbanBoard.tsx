import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import KanbanColumn from './KanbanColumn';

interface Candidate {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

interface KanbanColumnProps {
  title: string;
  candidates: Candidate[];
}

interface KanbanBoardProps {
  columns: KanbanColumnProps[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns }) => {
  return (
    <Container fluid className="mt-4">
      <Row>
        {columns.map((column, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <KanbanColumn title={column.title} candidates={column.candidates} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KanbanBoard;
