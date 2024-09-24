import React from 'react';
import { Card } from 'react-bootstrap';
import { Droppable } from 'react-beautiful-dnd';
import CandidateCard from './CandidateCard';
import { Candidate } from './Candidate';
import { InterviewStep } from './InterviewStep';

const KanbanColumn: React.FC<{
    interviewStep: InterviewStep;
    candidates: Candidate[];
}> = ({ interviewStep, candidates }) => {
    return (
        <Card className="shadow-sm">
            <Card.Header className="text-center">
                <strong>{interviewStep.name}</strong>
            </Card.Header>
            <Droppable droppableId={interviewStep.id.toString()}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-2 ${snapshot.isDraggingOver ? 'bg-light' : ''}`}
                        style={{ minHeight: '100px' }}
                    >
                        {candidates.map((candidate, index) => (
                            <CandidateCard key={candidate.id} candidate={candidate} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </Card>
    );
};

export default KanbanColumn;