import axios from 'axios';

// Función para obtener el flujo de entrevistas de una posición específica
export const getInterviewFlow = async (positionId) => {
    try {
        const response = await axios.get(`http://localhost:3010/position/${positionId}/interviewflow`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener el flujo de entrevistas: ' + (error.response?.data?.message || error.message));
    }
};

// Función para obtener los candidatos de una posición específica
export const getCandidatesByPosition = async (positionId) => {
    try {
        const response = await axios.get(`http://localhost:3010/position/${positionId}/candidates`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener los candidatos: ' + (error.response?.data?.message || error.message));
    }
};
