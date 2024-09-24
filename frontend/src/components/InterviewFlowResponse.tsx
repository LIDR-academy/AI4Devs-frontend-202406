import { InterviewStep } from './InterviewStep';

export interface InterviewFlowResponse {
    interviewFlow: {
        id: number;
        description: string;
        interviewSteps: InterviewStep[];
        positionName: string;
    };
}
