import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as positionService from '../services/positionService';
import * as candidateService from '../services/candidateService';
import { PositionData, InterviewFlow, InterviewStep } from '../types/PositionData';
import { Candidate } from '../types/Candidate';
import './Position.css'; // Asegúrate de importar el CSS

const Position: React.FC = () => {
  const { id } = useParams();
  const [positionData, setPositionData] = useState<PositionData | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        const data = await positionService.getInterviewFlow(id);
        console.log('Datos de positionData:', data);
        setPositionData(data.interviewFlow);
      } catch (error: any) {
        console.error('Error al obtener positionData:', error.message);
        setError('No se pudo cargar los datos de la posición.');
      }
    };

    const fetchCandidates = async () => {
      try {
        const data = await positionService.getCandidatesByPosition(id);
        console.log('Datos de candidates:', data);
        setCandidates(data);
      } catch (error: any) {
        console.error('Error al obtener candidatos:', error.message);
        setError('No se pudieron cargar los candidatos.');
      }
    };

    fetchPositionData();
    fetchCandidates();
  }, [id]);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
  
    const { source, destination, draggableId } = result;
    console.log('source:', source, 'destination:', destination, 'draggableId:', draggableId);
    if (source.droppableId !== destination.droppableId) {
      try {
        console.log(candidates);
        await candidateService.updateCandidateStage(
          parseInt(draggableId),
          candidates.find(candidate => candidate.id === parseInt(draggableId))?.applicationId,
          destination.droppableId.toString()
        );
  
        const updatedCandidates = Array.from(candidates);
        const sourceStep = source.droppableId;
        const destStep = destination.droppableId;
  
        const [movedCandidate] = updatedCandidates.splice(source.index, 1);
        movedCandidate.currentInterviewStep = destStep;
        updatedCandidates.splice(destination.index, 0, movedCandidate);
  
        setCandidates(updatedCandidates);
      } catch (error: any) {
        console.error('Error al actualizar la etapa:', error.message);
        setError('No se pudo actualizar la etapa del candidato.');
      }
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!positionData) return <div className="loading">Cargando...</div>;

  const { positionName, interviewFlow } = positionData;

  if (!interviewFlow || !interviewFlow.interviewSteps) {
    return <div className="no-data">Datos de flujo de entrevistas no disponibles.</div>;
  }

  return (
    <Container fluid className="mt-4 colorful-container">
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Button variant="success" href="/positions" className="back-button">
            <i className="bi bi-arrow-left"></i> Volver
          </Button>
        </Col>
        <Col>
          <h1 className="position-title">{positionName}</h1>
        </Col>
      </Row>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row>
          {interviewFlow.interviewSteps.map((step: InterviewStep) => (
            <Col key={step.id} xs={12} md={6} lg={3} className="mb-4">
              <Card className="step-card">
                <Card.Header className="step-header">{step.name}</Card.Header>
                <Card.Body>
                  <Droppable droppableId={step.id.toString()}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="candidate-list"
                      >
                        {candidates
                          .filter((candidate) => candidate.currentInterviewStep === step.id.toString())
                          .map((candidate, index) => (
                            <Draggable
                              key={candidate.id}
                              draggableId={candidate.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-2 candidate-card"
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
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </DragDropContext>
    </Container>
  );
};

export default Position;