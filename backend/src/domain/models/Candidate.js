"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candidate = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Candidate {
    constructor(data) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phone = data.phone;
        this.address = data.address;
        this.educations = data.educations || [];
        this.workExperiences = data.workExperiences || [];
        this.resumes = data.resumes || [];
        this.applications = data.applications || [];
    }
    async save() {
        const candidateData = {};
        // Solo añadir al objeto candidateData los campos que no son undefined
        if (this.firstName !== undefined)
            candidateData.firstName = this.firstName;
        if (this.lastName !== undefined)
            candidateData.lastName = this.lastName;
        if (this.email !== undefined)
            candidateData.email = this.email;
        if (this.phone !== undefined)
            candidateData.phone = this.phone;
        if (this.address !== undefined)
            candidateData.address = this.address;
        // Añadir educations si hay alguna para añadir
        if (this.educations.length > 0) {
            candidateData.educations = {
                create: this.educations.map(edu => ({
                    institution: edu.institution,
                    title: edu.title,
                    startDate: edu.startDate,
                    endDate: edu.endDate
                }))
            };
        }
        // Añadir workExperiences si hay alguna para añadir
        if (this.workExperiences.length > 0) {
            candidateData.workExperiences = {
                create: this.workExperiences.map(exp => ({
                    company: exp.company,
                    position: exp.position,
                    description: exp.description,
                    startDate: exp.startDate,
                    endDate: exp.endDate
                }))
            };
        }
        // Añadir resumes si hay alguno para añadir
        if (this.resumes.length > 0) {
            candidateData.resumes = {
                create: this.resumes.map(resume => ({
                    filePath: resume.filePath,
                    fileType: resume.fileType
                }))
            };
        }
        // Añadir applications si hay alguna para añadir
        if (this.applications.length > 0) {
            candidateData.applications = {
                create: this.applications.map(app => ({
                    positionId: app.positionId,
                    candidateId: app.candidateId,
                    applicationDate: app.applicationDate,
                    currentInterviewStep: app.currentInterviewStep,
                    notes: app.notes,
                }))
            };
        }
        if (this.id) {
            // Actualizar un candidato existente
            try {
                return await prisma.candidate.update({
                    where: { id: this.id },
                    data: candidateData
                });
            }
            catch (error) {
                console.log(error);
                if (error instanceof client_1.Prisma.PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                }
                else if (error.code === 'P2025') {
                    // Record not found error
                    throw new Error('No se pudo encontrar el registro del candidato con el ID proporcionado.');
                }
                else {
                    throw error;
                }
            }
        }
        else {
            // Crear un nuevo candidato
            try {
                const result = await prisma.candidate.create({
                    data: candidateData
                });
                return result;
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                }
                else {
                    throw error;
                }
            }
        }
    }
    static async findOne(id) {
        const data = await prisma.candidate.findUnique({
            where: { id: id },
            include: {
                educations: true,
                workExperiences: true,
                resumes: true,
                applications: {
                    include: {
                        position: {
                            select: {
                                id: true,
                                title: true
                            }
                        },
                        interviews: {
                            select: {
                                interviewDate: true,
                                interviewStep: {
                                    select: {
                                        name: true
                                    }
                                },
                                notes: true,
                                score: true
                            }
                        }
                    }
                }
            }
        });
        if (!data)
            return null;
        return new Candidate(data);
    }
}
exports.Candidate = Candidate;
