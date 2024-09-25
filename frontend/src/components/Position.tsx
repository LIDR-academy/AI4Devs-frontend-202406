import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  getInterviewFlowByPosition,
  getCandidatesByPosition,
} from "../services/candidateService";

// Define types for our data structures
type Candidate = {
  id: string;
  name: string;
  score: number;
};

type Column = {
  id: string;
  title: string;
  candidates: Candidate[];
};

type Board = {
  columns: Column[];
};

export default function Position() {
  const { title } = useParams<{ title: string }>();
  const [board, setBoard] = useState<Board>({ columns: [] });
  const [positionName, setPositionName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInterviewFlowByPosition(title);
        setPositionName(data.interviewFlow.positionName);
        const columns = data.interviewFlow.interviewFlow.interviewSteps.map(
          (step: any) => ({
            id: step.id,
            title: step.name,
            candidates: [],
          })
        );

        const candidatesData = await getCandidatesByPosition(title);
        candidatesData.forEach((candidate: any) => {
          const column = columns.find(
            (col: any) => col.title === candidate.currentInterviewStep
          );
          if (column) {
            column.candidates.push({
              id: candidate.id,
              name: candidate.fullName,
              score: candidate.averageScore,
            });
          }
        });

        setBoard({ columns });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [title]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = board.columns.find(
        (col) => col.id.toString() === source.droppableId
      );
      const destColumn = board.columns.find(
        (col) => col.id.toString() === destination.droppableId
      );
      const sourceCandidates = [...sourceColumn!.candidates];
      const destCandidates = [...destColumn!.candidates];
      const [removed] = sourceCandidates.splice(source.index, 1);
      destCandidates.splice(destination.index, 0, removed);
      setBoard({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id.toString() === source.droppableId) {
            return { ...col, candidates: sourceCandidates };
          }
          if (col.id.toString() === destination.droppableId) {
            return { ...col, candidates: destCandidates };
          }
          return col;
        }),
      });
    } else {
      const column = board.columns.find((col) => col.id === source.droppableId);
      const copiedCandidates = [...column!.candidates];
      const [removed] = copiedCandidates.splice(source.index, 1);
      copiedCandidates.splice(destination.index, 0, removed);
      setBoard({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, candidates: copiedCandidates };
          }
          return col;
        }),
      });
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6 flex items-center">
        <button className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">{positionName} Position</h1>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {board.columns.map((column) => (
            <div key={column.id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-4">{column.title}</h2>
              <Droppable
                droppableId={column.id.toString()}
                key={column.id.toString()}
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {column.candidates.map((candidate, index) => (
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
                            className="bg-gray-50 p-3 rounded border border-gray-200"
                          >
                            <div className="font-medium">{candidate.name}</div>
                            <div className="flex mt-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full mr-1 ${
                                    i < candidate.score
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
