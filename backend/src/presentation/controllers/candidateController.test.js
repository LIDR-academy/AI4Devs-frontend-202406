"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const candidateController_1 = require("./candidateController");
const candidateService_1 = require("../../application/services/candidateService");
jest.mock('../../application/services/candidateService');
describe('updateCandidateStageController', () => {
    it('should return 200 and updated candidate stage', async () => {
        const req = { params: { id: '1' }, body: { applicationId: 1, currentInterviewStep: 2 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        candidateService_1.updateCandidateStage.mockResolvedValue({
            id: 1,
            applicationId: 1,
            candidateId: 1,
            currentInterviewStep: 2,
        });
        await (0, candidateController_1.updateCandidateStageController)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Candidate stage updated successfully',
            data: {
                id: 1,
                applicationId: 1,
                candidateId: 1,
                currentInterviewStep: 2,
            },
        });
    });
});
