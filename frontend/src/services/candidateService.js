import axios from 'axios';

export const uploadCV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post('http://localhost:3010/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Devuelve la ruta del archivo y el tipo
    } catch (error) {
        throw new Error('Error al subir el archivo: ' + (error.response?.data?.message || error.message));
    }
};

export const sendCandidateData = async (candidateData) => {
    try {
        const response = await axios.post('http://localhost:3010/candidates', candidateData);
        return response.data;
    } catch (error) {
        throw new Error('Error al enviar datos del candidato: ' + (error.response?.data?.message || error.message));
    }
};

// Nueva función para actualizar la etapa del candidato
export const updateCandidateStage = async (candidateId, applicationId, currentInterviewStep) => {
    try {
        const response = await axios.put(`http://localhost:3010/candidates/${candidateId}`, {
            applicationId,
            currentInterviewStep,
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar la etapa del candidato: ' + (error.response?.data?.message || error.message));
    }
};