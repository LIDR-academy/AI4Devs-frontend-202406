"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Education = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Education {
    constructor(data) {
        this.id = data.id;
        this.institution = data.institution;
        this.title = data.title;
        this.startDate = new Date(data.startDate);
        this.endDate = data.endDate ? new Date(data.endDate) : undefined;
        this.candidateId = data.candidateId;
    }
    async save() {
        const educationData = {
            institution: this.institution,
            title: this.title,
            startDate: this.startDate,
            endDate: this.endDate,
        };
        if (this.candidateId !== undefined) {
            educationData.candidateId = this.candidateId;
        }
        if (this.id) {
            // Actualizar una experiencia laboral existente
            return await prisma.education.update({
                where: { id: this.id },
                data: educationData
            });
        }
        else {
            // Crear una nueva experiencia laboral
            return await prisma.education.create({
                data: educationData
            });
        }
    }
}
exports.Education = Education;
