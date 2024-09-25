import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInterviewFlow, getCandidates } from "../services/positionService";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

type InterviewStep = {
    id: number;
    interviewFlowId: number;
    interviewTypeId: number;
    name: string;
    orderIndex: number;
};

type Candidate = {
    id: string;
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
};

type InterviewFlowResponse = {
    interviewFlow: {
        positionName: string;
        interviewFlow: {
            id: number;
            description: string;
            interviewSteps: InterviewStep[];
        };
    };
};

const Position: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [interviewFlow, setInterviewFlow] =
        useState<InterviewFlowResponse | null>(null);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterviewFlow = async () => {
            try {
                const data = await getInterviewFlow(id);
                setInterviewFlow(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Error desconocido"
                );
            } finally {
                setLoading(false);
            }
        };

        const fetchCandidates = async () => {
            try {
                const candidatesData = await getCandidates(id);
                const candidatesWithIds = candidatesData.map(
                    (candidate: Candidate) => ({
                        ...candidate,
                        id: uuidv4(),
                    })
                );
                setCandidates(candidatesWithIds);
                console.log("Candidatos:", candidatesWithIds);
            } catch (err) {
                console.error(err);
            }
        };

        fetchInterviewFlow();
        fetchCandidates();
    }, [id]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    if (!interviewFlow || !interviewFlow.interviewFlow) {
        return <p>No se encontraron datos para esta posición.</p>;
    }

    const interviewSteps =
        interviewFlow.interviewFlow.interviewFlow.interviewSteps;
    const sortedSteps = interviewSteps.sort(
        (a, b) => a.orderIndex - b.orderIndex
    );

    const handleDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const updatedCandidates = Array.from(candidates);
        const movedCandidateIndex = updatedCandidates.findIndex(
            (c) => c.id === draggableId
        );
        const [reorderedCandidate] = updatedCandidates.splice(
            movedCandidateIndex,
            1
        );

        const newStep = interviewSteps.find(
            (step) => step.id.toString() === destination.droppableId
        );

        if (newStep) {
            reorderedCandidate.currentInterviewStep = newStep.name;
        }

        // Encontrar el índice correcto en la columna de destino
        const destinationCandidates = updatedCandidates.filter(
            (c) => c.currentInterviewStep === newStep?.name
        );
        const insertIndex =
            destinationCandidates.length > destination.index
                ? updatedCandidates.indexOf(
                      destinationCandidates[destination.index]
                  )
                : updatedCandidates.length;

        updatedCandidates.splice(insertIndex, 0, reorderedCandidate);

        setCandidates(updatedCandidates);

        console.log("Candidato movido:", reorderedCandidate);
        console.log("Columna destino:", newStep);

        // Aquí deberías llamar a una función para actualizar el candidato en el backend
        // updateCandidateStep(reorderedCandidate.id, newStep.id);
    };

    return (
        <div style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "20px",
                }}
            >
                Volver
            </button>

            <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
                {interviewFlow?.interviewFlow.positionName}
            </h1>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: "30px",
                        overflowX: "auto",
                        padding: "10px 0",
                    }}
                >
                    {sortedSteps.map((step) => (
                        <Droppable
                            key={step.id}
                            droppableId={step.id.toString()}
                        >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: "8px",
                                        width: "200px",
                                        padding: "15px",
                                        minHeight: "300px",
                                        boxShadow:
                                            "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        flexShrink: 0,
                                    }}
                                >
                                    <h3
                                        style={{
                                            textAlign: "left",
                                            fontSize: "18px",
                                            marginBottom: "15px",
                                            color: "#333",
                                        }}
                                    >
                                        {step.name}
                                    </h3>
                                    {candidates
                                        .filter(
                                            (candidate) =>
                                                candidate.currentInterviewStep ===
                                                step.name
                                        )
                                        .map((candidate, index) => (
                                            <Draggable
                                                key={candidate.id}
                                                draggableId={candidate.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided
                                                                .draggableProps
                                                                .style,
                                                            backgroundColor:
                                                                "white",
                                                            margin: "10px 0",
                                                            padding: "10px",
                                                            borderRadius: "4px",
                                                            boxShadow:
                                                                "0 1px 3px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "16px",
                                                                fontWeight:
                                                                    "bold",
                                                                marginBottom:
                                                                    "5px",
                                                            }}
                                                        >
                                                            {candidate.fullName}
                                                        </div>
                                                        <div>
                                                            {Array.from(
                                                                {
                                                                    length: candidate.averageScore,
                                                                },
                                                                (_, i) => (
                                                                    <span
                                                                        key={i}
                                                                        style={{
                                                                            color: "#4CAF50",
                                                                            fontSize:
                                                                                "20px",
                                                                            marginRight:
                                                                                "2px",
                                                                        }}
                                                                    >
                                                                        ●
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Position;
