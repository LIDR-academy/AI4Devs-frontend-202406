"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const candidateService_1 = require("./candidateService");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        application: {
            findFirst: jest.fn(),
            update: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});
describe('updateCandidateStage', () => {
    it('should update the candidate stage and return the updated application', async () => {
        const mockApplication = {
            id: 1,
            positionId: 1,
            candidateId: 1,
            currentInterviewStep: 1,
            applicationDate: new Date(),
            notes: null,
        };
        jest.spyOn(prisma.application, 'findFirst').mockResolvedValue(mockApplication);
        jest.spyOn(prisma.application, 'update').mockResolvedValue({
            ...mockApplication,
            currentInterviewStep: 2,
        });
        const result = await (0, candidateService_1.updateCandidateStage)(1, 1, 2);
        expect(result).toEqual(expect.objectContaining({
            ...mockApplication,
            currentInterviewStep: 2,
        }));
    });
});
