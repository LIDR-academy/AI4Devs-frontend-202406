import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import axios from 'axios';
import KanbanColumn from './KanbanColumn';
import { useParams, useNavigate } from 'react-router-dom';
import { Candidate } from './Candidate';
import { InterviewFlowResponse } from './InterviewFlowResponse';
import { InterviewStep } from './InterviewStep';

const KanbanBoard: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [positionName, setPositionName] = useState<string>('');
    const [interviewSteps, setInterviewSteps] = useState<InterviewStep[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);

    useEffect(() => {
        fetchInterviewFlow();
        fetchCandidates();
    }, [id]);

    const fetchInterviewFlow = async () => {
        try {
            const res = await axios.get<InterviewFlowResponse>(`http://localhost:3010/positions/${id}/interviewFlow`);
            console.log('Interview Flow Response:', res.data); // Added logging
            setPositionName(res.data.interviewFlow.positionName);
            // Sort interview steps by orderIndex
            const sortedSteps = res.data.interviewFlow.interviewSteps.sort((a, b) => a.orderIndex - b.orderIndex);
            setInterviewSteps(sortedSteps);
        } catch (error) {
            console.error('Error fetching interview flow:', error);
        }
    };

    const fetchCandidates = async () => {
        try {
            const res = await axios.get<Candidate[]>(`http://localhost:3010/positions/${id}/candidates`);
            setCandidates(res.data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const currentCandidate = candidates.find(candidate => candidate.id === parseInt(draggableId));
        if (!currentCandidate) {
            console.error('Candidate not found');
            return;
        }
        const candidateId = parseInt(draggableId);
        const newInterviewStepId = parseInt(destination.droppableId);

        try {
            await axios.put(`http://localhost:3010/candidates/${candidateId}/stage`, {
                applicationId: currentCandidate.applicationId,
                currentInterviewStep: newInterviewStepId
            });
            // Update the candidate's currentInterviewStep locally
            setCandidates(prev =>
                prev.map(candidate =>
                    candidate.id === candidateId
                        ? { ...candidate, currentInterviewStep: interviewSteps.find(step => step.id === newInterviewStepId)?.name || candidate.currentInterviewStep }
                        : candidate
                )
            );
        } catch (error) {
            console.error('Error updating candidate stage:', error);
            // Optionally, display an error message to the user
            alert('Hubo un error al actualizar la etapa del candidato. Por favor, inténtalo de nuevo.');
        }
    };

    // Organize candidates by interview step
    const columns: { [key: string]: Candidate[] } = {};

    interviewSteps.forEach(step => {
        columns[step.name] = candidates.filter(candidate => candidate.currentInterviewStep === step.name);
    });

    return (
        <Container fluid className="mt-4">
            <Row className="mb-3">
                <Col>
                    <Button variant="link" onClick={() => navigate('/positions')}>
                        &larr; Volver a Posiciones
                    </Button>
                </Col>
                <Col className="text-center">
                    <h2>{positionName}</h2>
                </Col>
                <Col></Col>
            </Row>
            <DragDropContext onDragEnd={onDragEnd}>
                <Row>
                    {interviewSteps.map(step => (
                        <Col md={4} sm={12} key={step.id} className="mb-4">
                            <KanbanColumn interviewStep={step} candidates={columns[step.name] || []} />
                        </Col>
                    ))}
                </Row>
            </DragDropContext>
        </Container>
    );
};

export default KanbanBoard;