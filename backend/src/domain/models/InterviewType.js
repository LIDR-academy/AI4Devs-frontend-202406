"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewType = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class InterviewType {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
    }
    async save() {
        const interviewTypeData = {
            name: this.name,
            description: this.description,
        };
        if (this.id) {
            return await prisma.interviewType.update({
                where: { id: this.id },
                data: interviewTypeData,
            });
        }
        else {
            return await prisma.interviewType.create({
                data: interviewTypeData,
            });
        }
    }
    static async findOne(id) {
        const data = await prisma.interviewType.findUnique({
            where: { id: id },
        });
        if (!data)
            return null;
        return new InterviewType(data);
    }
}
exports.InterviewType = InterviewType;
