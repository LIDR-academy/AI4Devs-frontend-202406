import React from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';

const PositionDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <KanbanBoard />
        </div>
    );
};

export default PositionDetails;