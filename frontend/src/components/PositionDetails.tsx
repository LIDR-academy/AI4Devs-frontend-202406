// frontend/src/components/PositionDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import InterviewColumn from './InterviewColumn';

type InterviewStep = {
  id: number;
  name: string;
  orderIndex: number;
};

type Candidate = {
  id: number;
  applicationId: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
};

type Column = {
  id: number;
  name: string;
  candidates: Candidate[];
};

const PositionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [positionName, setPositionName] = useState('');
  const [columns, setColumns] = useState<Column[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = 'http://localhost:3010';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flowResponse = await fetch(`${API_BASE_URL}/position/${id}/interviewFlow`);
        if (!flowResponse.ok) {
          throw new Error(`Error ${flowResponse.status}: ${flowResponse.statusText}`);
        }
        const flowData = await flowResponse.json();

        setPositionName(flowData.positionName);

        const interviewSteps: InterviewStep[] = Array.isArray(flowData.interviewFlow?.interviewSteps)
          ? flowData.interviewFlow.interviewSteps
          : [];

        if (interviewSteps.length === 0) {
          console.warn('No se encontraron interviewSteps en la respuesta.');
        }

        const candidatesResponse = await fetch(`${API_BASE_URL}/position/${id}/candidates`);
        if (!candidatesResponse.ok) {
          throw new Error(`Error ${candidatesResponse.status}: ${candidatesResponse.statusText}`);
        }
        const candidatesData: Candidate[] = await candidatesResponse.json();

        console.log('Candidatos recibidos:', candidatesData);

        const columnsData: Column[] = interviewSteps.map((step) => ({
          id: step.id,
          name: step.name,
          candidates: [],
        }));

        candidatesData.forEach((candidate) => {
          const column = columnsData.find((col) => col.name === candidate.currentInterviewStep);
          if (column) {
            column.candidates.push(candidate);
          }
        });

        setColumns(columnsData);
        setError(null); 
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, [id]);

  const moveCandidate = (candidate: Candidate, toColumnId: number) => {
    if (!candidate.id || !candidate.applicationId) {
      console.error('El candidato no tiene un ID o ApplicationID válido:', candidate);
      return;
    }

    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column.candidates.find((c) => c.id === candidate.id)) {
          return {
            ...column,
            candidates: column.candidates.filter((c) => c.id !== candidate.id),
          };
        } else if (column.id === toColumnId) {
          return {
            ...column,
            candidates: [
              ...column.candidates,
              { ...candidate, currentInterviewStep: column.name },
            ],
          };
        } else {
          return column;
        }
      })
    );

    console.log('Actualizando candidato:', candidate.id, candidate.applicationId);

    fetch(`${API_BASE_URL}/candidates/${candidate.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: candidate.applicationId,
        currentInterviewStep: toColumnId.toString(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Candidate updated:', data);
      })
      .catch((error) => {
        console.error('Error updating candidate:', error);
        setError(error.message);
      });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid className="mt-4">
        <Row className="mb-3 align-items-center">
          <Col xs="auto">
            <Link to="/positions">
              <Button variant="link">
                <ArrowLeft size={24} />
              </Button>
            </Link>
          </Col>
          <Col>
            <h2>{positionName}</h2>
          </Col>
        </Row>
        {error && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger">Error: {error}</Alert>
            </Col>
          </Row>
        )}
        <Row className="d-flex flex-row flex-nowrap overflow-auto">
          {columns.map((column) => (
            <InterviewColumn key={column.id} column={column} moveCandidate={moveCandidate} />
          ))}
        </Row>
      </Container>
    </DndProvider>
  );
};

export default PositionDetails;