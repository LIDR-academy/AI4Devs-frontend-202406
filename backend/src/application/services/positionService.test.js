"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positionService_1 = require("./positionService");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        application: {
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});
describe('getCandidatesByPositionService', () => {
    it('should return candidates with their average scores', async () => {
        const mockApplications = [
            {
                id: 1,
                positionId: 1,
                candidateId: 1,
                applicationDate: new Date(),
                currentInterviewStep: 1,
                notes: null,
                candidate: { firstName: 'John', lastName: 'Doe' },
                interviewStep: { name: 'Technical Interview' },
                interviews: [{ score: 5 }, { score: 3 }],
            },
        ];
        jest.spyOn(prisma.application, 'findMany').mockResolvedValue(mockApplications);
        const result = await (0, positionService_1.getCandidatesByPositionService)(1);
        expect(result).toEqual([
            {
                fullName: 'John Doe',
                currentInterviewStep: 'Technical Interview',
                averageScore: 4,
            },
        ]);
    });
});
