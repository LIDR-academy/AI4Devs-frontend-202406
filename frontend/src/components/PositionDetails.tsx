import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Position } from './Positions';

type PositionDetailsProps = {
  positions: Position[];
};

const PositionDetails: React.FC<PositionDetailsProps> = ({ positions }) => {
  const { id } = useParams<{ id: string }>();
  const position = positions.find(p => p.id === parseInt(id || ''));

  if (!position) {
    return <div>Position not found</div>;
  }

  return (
    <Container className="mt-5">
      <Link to="/positions" className="inline-block mb-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 transition-colors">
        &larr; Back to Positions
      </Link>
      <h2 className="text-center mb-4">{position.title}</h2>
      {/* We will add the rest of the layout later */}
    </Container>
  );
};

export default PositionDetails;
