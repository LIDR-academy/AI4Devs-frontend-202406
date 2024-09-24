import React from 'react';
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export type Position = {
  id: number;
  title: string;
  status: string;
  applicationDeadline: string;
  companyDescription: string;
  contactInfo: string;
};

const Positions: React.FC<{ positions: Position[], loading: boolean, error: string | null }> = ({ positions, loading, error }) => {

  if (loading) {
    return <div>Loading positions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Posiciones</h2>
      <Row className="mb-4">
        <Col md={3}>
          <Form.Control type="text" placeholder="Buscar por título" />
        </Col>
        <Col md={3}>
          <Form.Control type="date" placeholder="Buscar por fecha" />
        </Col>
        <Col md={3}>
            <Form.Control as="select">
              <option value="">Estado</option>
              <option value="Open">Abierto</option>
              <option value="Closed">Cerrado</option>
              <option value="Draft">Borrador</option>
            </Form.Control>
        </Col><Col md={3}>
            <Form.Control as="select">
              <option value="">Manager</option>
              <option value="name1">Manager 1</option>
              <option value="name2">Manager 2</option>
              <option value="name3">Manager 3</option>
            </Form.Control>
        </Col>
      </Row>
      <Row>
        {positions.map((position) => (
          <Col md={4} key={position.id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{position.title}</Card.Title>
                <Card.Text>
                  <strong>Manager:</strong> {position.contactInfo}<br />
                  <strong>Deadline:</strong> {new Date(position.applicationDeadline).toLocaleDateString()}<br />
                  <strong>Company:</strong> {position.companyDescription}
                </Card.Text>
                <span className={`badge ${position.status === 'Open' ? 'bg-warning' : position.status === 'Closed' ? 'bg-danger' : 'bg-secondary'} text-white`}>
                  {position.status}
                </span>
                <div className="d-flex justify-content-between mt-3">
                  <Link to={`/positions/${position.id}`}>
                    <Button variant="primary">Ver proceso</Button>
                  </Link>
                  <Button variant="secondary">Editar</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Positions;