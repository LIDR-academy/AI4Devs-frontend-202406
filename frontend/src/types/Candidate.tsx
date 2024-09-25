export interface Candidate {
    id: number;
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
    applicationId: number; // Asumiendo que se necesita para actualizar
  }