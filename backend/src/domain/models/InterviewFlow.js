"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewFlow = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class InterviewFlow {
    constructor(data) {
        this.id = data.id;
        this.description = data.description;
    }
    async save() {
        const interviewFlowData = {
            description: this.description,
        };
        if (this.id) {
            return await prisma.interviewFlow.update({
                where: { id: this.id },
                data: interviewFlowData,
            });
        }
        else {
            return await prisma.interviewFlow.create({
                data: interviewFlowData,
            });
        }
    }
    static async findOne(id) {
        const data = await prisma.interviewFlow.findUnique({
            where: { id: id },
        });
        if (!data)
            return null;
        return new InterviewFlow(data);
    }
}
exports.InterviewFlow = InterviewFlow;
