import React from 'react';
import { Card } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';
import { Candidate } from './Candidate';
import { FaCircle } from 'react-icons/fa';

const CandidateCard: React.FC<{ candidate: Candidate; index: number }> = ({ candidate, index }) => {
    const renderRating = (score: number) => {
        const maxRating = 5;
        const filledCircles = Math.round(score);
        
        return Array(maxRating).fill(0).map((_, i) => (
            <FaCircle 
                key={i} 
                className={`me-1 ${i < filledCircles ? 'text-success' : 'text-muted'}`} 
            />
        ));
    };

    return (
        <Draggable draggableId={candidate.id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`mb-2 ${snapshot.isDragging ? 'bg-light' : ''}`}
                >
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <Card.Title className="mb-0 fs-5">{candidate.fullName}</Card.Title>
                                {renderRating(candidate.averageScore)}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </Draggable>
    );
};

export default CandidateCard;