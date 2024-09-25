import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecruiterDashboard from "./components/RecruiterDashboard";
import AddCandidate from "./components/AddCandidateForm";
import Positions from "./components/Positions";
import Position from "./components/Position"; // Importa el nuevo componente

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RecruiterDashboard />} />
                <Route path="/add-candidate" element={<AddCandidate />} />
                <Route path="/positions" element={<Positions />} />
                <Route path="/position/:id" element={<Position />} />{" "}
                {/* Nueva ruta */}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
