import axios from "axios";

export const getInterviewFlow = async (id) => {
    try {
        const response = await axios.get(
            `http://localhost:3010/position/${id}/interviewFlow`
        );
        return response.data; // Devuelve los datos de la posición
    } catch (error) {
        throw new Error(
            "Error al obtener el flujo de entrevistas:",
            error.response.data
        );
    }
};

export const getCandidates = async (id) => {
    try {
        const response = await axios.get(
            `http://localhost:3010/position/${id}/candidates`
        );
        return response.data; // Devuelve la lista de candidatos
    } catch (error) {
        throw new Error(
            "Error al obtener los candidatos:",
            error.response.data
        );
    }
};
