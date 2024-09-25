"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Application {
    constructor(data) {
        this.id = data.id;
        this.positionId = data.positionId;
        this.candidateId = data.candidateId;
        this.applicationDate = new Date(data.applicationDate);
        this.currentInterviewStep = data.currentInterviewStep;
        this.notes = data.notes;
        this.interviews = data.interviews || []; // Added this line
    }
    async save() {
        const applicationData = {
            positionId: this.positionId,
            candidateId: this.candidateId,
            applicationDate: this.applicationDate,
            currentInterviewStep: this.currentInterviewStep,
            notes: this.notes,
        };
        if (this.id) {
            return await prisma.application.update({
                where: { id: this.id },
                data: applicationData,
            });
        }
        else {
            return await prisma.application.create({
                data: applicationData,
            });
        }
    }
    static async findOne(id) {
        const data = await prisma.application.findUnique({
            where: { id: id },
        });
        if (!data)
            return null;
        return new Application(data);
    }
    static async findOneByPositionCandidateId(applicationIdNumber, candidateId) {
        const data = await prisma.application.findFirst({
            where: {
                id: applicationIdNumber,
                candidateId: candidateId
            }
        });
        if (!data)
            return null;
        return new Application(data);
    }
}
exports.Application = Application;
