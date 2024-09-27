import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import KanbanColumn from './KanbanColumn';

const KanbanBoard: React.FC = () => {
  const columns = [
    { title: 'Llamada telefónica', candidates: [
      { name: 'John Doe', score: 3 },
      { name: 'Alice Johnson', score: 4 }
    ]},
    { title: 'Entrevista técnica', candidates: [
      { name: 'Jane Smith', score: 3 }
    ]},
    { title: 'Entrevista cultural', candidates: [
      { name: 'Bob Brown', score: 2 }
    ]},
    { title: 'Entrevista manager', candidates: [
      { name: 'Eva White', score: 5 }
    ]}
  ];

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
