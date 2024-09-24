import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm';
import Positions from './components/Positions';
import PositionDetails from './components/PositionDetails';

const App = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3010/positions');
        if (!response.ok) {
          throw new Error('Failed to fetch positions');
        }
        const data = await response.json();
        setPositions(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching positions:', error);
        setError('Failed to load positions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/positions" element={<Positions positions={positions} loading={loading} error={error} />} />
        <Route path="/positions/:id" element={<PositionDetails positions={positions} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;