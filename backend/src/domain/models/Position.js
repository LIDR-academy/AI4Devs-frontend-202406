"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Position {
    constructor(data) {
        this.id = data.id;
        this.companyId = data.companyId;
        this.interviewFlowId = data.interviewFlowId;
        this.title = data.title;
        this.description = data.description;
        this.status = data.status ?? 'Draft';
        this.isVisible = data.isVisible ?? false;
        this.location = data.location;
        this.jobDescription = data.jobDescription;
        this.requirements = data.requirements;
        this.responsibilities = data.responsibilities;
        this.salaryMin = data.salaryMin;
        this.salaryMax = data.salaryMax;
        this.employmentType = data.employmentType;
        this.benefits = data.benefits;
        this.companyDescription = data.companyDescription;
        this.applicationDeadline = data.applicationDeadline ? new Date(data.applicationDeadline) : undefined;
        this.contactInfo = data.contactInfo;
    }
    async save() {
        const positionData = {
            companyId: this.companyId,
            interviewFlowId: this.interviewFlowId,
            title: this.title,
            description: this.description,
            status: this.status,
            isVisible: this.isVisible,
            location: this.location,
            jobDescription: this.jobDescription,
            requirements: this.requirements,
            responsibilities: this.responsibilities,
            salaryMin: this.salaryMin,
            salaryMax: this.salaryMax,
            employmentType: this.employmentType,
            benefits: this.benefits,
            companyDescription: this.companyDescription,
            applicationDeadline: this.applicationDeadline,
            contactInfo: this.contactInfo,
        };
        if (this.id) {
            return await prisma.position.update({
                where: { id: this.id },
                data: positionData,
            });
        }
        else {
            return await prisma.position.create({
                data: positionData,
            });
        }
    }
    static async findOne(id) {
        const data = await prisma.position.findUnique({
            where: { id: id },
        });
        if (!data)
            return null;
        return new Position(data);
    }
    static async findOneWithInterviewFlow(id) {
        const data = await prisma.position.findUnique({
            where: { id: id },
            include: {
                interviewFlow: {
                    include: {
                        interviewSteps: true
                    }
                }
            }
        });
        if (!data)
            return null;
        return new Position(data);
    }
}
exports.Position = Position;
