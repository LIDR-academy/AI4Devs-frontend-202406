import axios from "axios";

export const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "http://localhost:3010/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // Devuelve la ruta del archivo y el tipo
  } catch (error) {
    throw new Error("Error al subir el archivo:", error.response.data);
  }
};

export const sendCandidateData = async (candidateData) => {
  try {
    const response = await axios.post(
      "http://localhost:3010/candidates",
      candidateData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      "Error al enviar datos del candidato:",
      error.response.data
    );
  }
};

// Function to get interview flow by position ID
export const getInterviewFlowByPosition = async (positionId) => {
  try {
    const response = await axios.get(
      `http://localhost:3010/position/${positionId}/interviewFlow`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      "Error al obtener el flujo de entrevistas:",
      error.response.data
    );
  }
};


// New function to get candidates by position ID
export const getCandidatesByPosition = async (positionId) => {
  try {
    const response = await axios.get(
      `http://localhost:3010/position/${positionId}/candidates`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los candidatos:", error.response.data);
  }
};
