"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positionController_1 = require("./positionController");
const positionService_1 = require("../../application/services/positionService");
jest.mock('../../application/services/positionService');
describe('getCandidatesByPosition', () => {
    it('should return 200 and candidates data', async () => {
        const req = { params: { id: '1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        positionService_1.getCandidatesByPositionService.mockResolvedValue([
            { fullName: 'John Doe', currentInterviewStep: 'Technical Interview', averageScore: 4 },
        ]);
        await (0, positionController_1.getCandidatesByPosition)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            { fullName: 'John Doe', currentInterviewStep: 'Technical Interview', averageScore: 4 },
        ]);
    });
});
