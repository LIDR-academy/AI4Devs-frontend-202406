import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import axios from '../axiosConfig';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Definición de los tipos de elementos que se pueden arrastrar
const ItemTypes = {
  CANDIDATE: 'candidate',
};

// Componente para la tarjeta del candidato (Draggable)
const CandidateCard = ({ candidate }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CANDIDATE,
    item: { applicationId: candidate.applicationId, currentStep: candidate.currentInterviewStep },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Card
      ref={drag}
      className="mb-3"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <Card.Body>
        <Card.Title>{candidate.fullName}</Card.Title>
        <Card.Text>Puntuación: {candidate.averageScore}</Card.Text>
      </Card.Body>
    </Card>
  );
};

// Componente para cada columna del Kanban (Droppable)
const Column = ({ step, candidates, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CANDIDATE,
    drop: (item) => onDrop(item.applicationId, step.id),
    canDrop: (item) => item.currentStep !== step.name,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  const backgroundColor = isActive ? '#d4edda' : '#f8f9fa'; // Verde claro cuando se puede soltar

  return (
    <Card className="h-100">
      <Card.Header className="bg-primary text-white">{step.name}</Card.Header>
      <Card.Body
        ref={drop}
        style={{
          minHeight: '200px',
          backgroundColor,
        }}
      >
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.applicationId} candidate={candidate} />
        ))}
      </Card.Body>
    </Card>
  );
};

const KanbanBoard = () => {
  const { id } = useParams();
  const [positionName, setPositionName] = useState('');
  const [interviewSteps, setInterviewSteps] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch data desde los endpoints al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flowRes, candidatesRes] = await Promise.all([
          axios.get(`/position/${id}/interviewFlow`),
          axios.get(`/position/${id}/candidates`),
        ]);

        const flowData = flowRes.data;
        setPositionName(flowData.positionName);
        setInterviewSteps(flowData.interviewFlow.interviewSteps);

        // Asegurarse de que cada candidato tenga un applicationId único
        const candidatesWithApplicationId = candidatesRes.data.map((candidate) => ({
          ...candidate,
          applicationId: candidate.applicationId, // Asegúrate de que el backend incluya applicationId
        }));

        setCandidates(candidatesWithApplicationId);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos del proceso de contratación.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Manejar el evento de soltar un candidato en una nueva columna
  const handleDrop = useCallback(
    async (applicationId, newStepId) => {
      const candidate = candidates.find((c) => c.applicationId === applicationId);
      if (!candidate) {
        setError('Candidato no encontrado.');
        return;
      }

      const newStep = interviewSteps.find((step) => step.id === newStepId);
      if (!newStep) {
        setError('Etapa de entrevista no válida.');
        return;
      }

      // Actualizar el estado local optimísticamente
      const updatedCandidates = candidates.map((c) =>
        c.applicationId === applicationId
          ? { ...c, currentInterviewStep: newStep.name }
          : c
      );
      setCandidates(updatedCandidates);
      setSuccessMessage('');
      setError('');

      // Realizar la actualización en el backend
      try {
        await axios.put(`/candidates/${applicationId}`, {
          applicationId: applicationId,
          currentInterviewStep: newStep.id,
        });
        setSuccessMessage('Fase del candidato actualizada exitosamente.');
      } catch (err) {
        console.error('Error actualizando la fase del candidato:', err);
        setError('No se pudo actualizar la fase del candidato.');
        // Revertir el cambio en el estado local si falla
        setCandidates(candidates);
      }
    },
    [candidates, interviewSteps]
  );

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
    <DndProvider backend={HTML5Backend}>
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

        <Row className="flex-nowrap overflow-auto">
          {interviewSteps.map((step) => {
            const stepCandidates = candidates.filter(
              (candidate) => candidate.currentInterviewStep === step.name
            );

            return (
              <Col key={step.id} xs={12} md={4} lg={3} className="mb-4">
                <Column step={step} candidates={stepCandidates} onDrop={handleDrop} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </DndProvider>
  );
};

export default KanbanBoard;