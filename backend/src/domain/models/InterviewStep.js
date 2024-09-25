"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewStep = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class InterviewStep {
    constructor(data) {
        this.id = data.id;
        this.interviewFlowId = data.interviewFlowId;
        this.interviewTypeId = data.interviewTypeId;
        this.name = data.name;
        this.orderIndex = data.orderIndex;
    }
    async save() {
        const interviewStepData = {
            interviewFlowId: this.interviewFlowId,
            interviewTypeId: this.interviewTypeId,
            name: this.name,
            orderIndex: this.orderIndex,
        };
        if (this.id) {
            return await prisma.interviewStep.update({
                where: { id: this.id },
                data: interviewStepData,
            });
        }
        else {
            return await prisma.interviewStep.create({
                data: interviewStepData,
            });
        }
    }
    static async findOne(id) {
        const data = await prisma.interviewStep.findUnique({
            where: { id: id },
        });
        if (!data)
            return null;
        return new InterviewStep(data);
    }
}
exports.InterviewStep = InterviewStep;
