import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from '../axiosConfig';
import { ArrowLeft } from 'react-bootstrap-icons';

const KanbanBoard = () => {
  const { id } = useParams();
  const [positionName, setPositionName] = useState('');
  const [interviewSteps, setInterviewSteps] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flowRes, candidatesRes] = await Promise.all([
          axios.get(`/position/${id}/interviewFlow`),
          axios.get(`/position/${id}/candidates`)
        ]);

        const flowData = flowRes.data;
        setPositionName(flowData.positionName);
        setInterviewSteps(flowData.interviewFlow.interviewSteps);

        // Asignar un ID único a cada candidato si no lo tienen
        const candidatesWithId = candidatesRes.data.map((candidate, index) => ({
          ...candidate,
          uniqueId: `${index}-${candidate.fullName.replace(/\s+/g, '-').toLowerCase()}`
        }));
        setCandidates(candidatesWithId);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos del proceso de contratación.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Si no hay destino, salir
    if (!destination) return;

    // Si la posición no cambia, salir
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Encontrar al candidato arrastrado
    const draggedCandidate = candidates.find(
      (candidate) => candidate.uniqueId === draggableId
    );

    if (!draggedCandidate) {
      setError('Candidato no encontrado.');
      return;
    }

    // Actualizar la fase en el estado local
    const updatedCandidates = candidates.map((candidate) =>
      candidate.uniqueId === draggableId
        ? { ...candidate, currentInterviewStep: interviewSteps[destination.droppableId - 1].name }
        : candidate
    );

    setCandidates(updatedCandidates);

    // Realizar la actualización en el backend
    try {
      await axios.put(`/candidates/${draggableId}`, {
        applicationId: draggedCandidate.applicationId || draggableId, // Asegúrate de tener applicationId
        currentInterviewStep: interviewSteps[destination.droppableId - 1].id
      });
      setSuccessMessage('Fase del candidato actualizada exitosamente.');
      setError('');
    } catch (err) {
      console.error('Error actualizando la fase del candidato:', err);
      setError('No se pudo actualizar la fase del candidato.');
      // Revertir el cambio en el estado local
      setCandidates(candidates);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4 px-3">
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Link to="/positions" className="text-decoration-none">
            <ArrowLeft size={30} />
          </Link>
        </Col>
        <Col>
          <h2 className="mb-0">{positionName}</h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Row className="flex-nowrap overflow-auto">
          {interviewSteps.map((step, index) => {
            const stepCandidates = candidates.filter(
              (candidate) => candidate.currentInterviewStep === step.name
            );

            return (
              <Col key={step.id} xs={12} md={4} lg={3} className="mb-4">
                <Card className="h-100">
                  <Card.Header className="bg-primary text-white">
                    {step.name}
                  </Card.Header>
                  <Droppable droppableId={(index + 1).toString()}>
                    {(provided) => (
                      <Card.Body
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ minHeight: '200px', backgroundColor: '#f8f9fa' }}
                      >
                        {stepCandidates.map((candidate, idx) => (
                          <Draggable
                            key={candidate.uniqueId}
                            draggableId={candidate.uniqueId}
                            index={idx}
                          >
                            {(provided) => (
                              <Card
                                className="mb-3"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card.Body>
                                  <Card.Title>{candidate.fullName}</Card.Title>
                                  <Card.Text>Puntuación: {candidate.averageScore}</Card.Text>
                                </Card.Body>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Card.Body>
                    )}
                  </Droppable>
                </Card>
              </Col>
            );
          })}
        </Row>
      </DragDropContext>
    </Container>
  );
};

export default KanbanBoard;