export interface PositionData {
    positionName: string;
    interviewFlow: InterviewFlow;
  }

export interface InterviewFlow {
    id: number;
    description: string;
    interviewSteps: InterviewStep[];
  }

  export interface InterviewStep {
    id: number;
    interviewFlowId: number;
    interviewTypeId: number;
    name: string;
    orderIndex: number;
  }