"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCandidateStage = exports.findCandidateById = exports.addCandidate = void 0;
const Candidate_1 = require("../../domain/models/Candidate");
const validator_1 = require("../validator");
const Education_1 = require("../../domain/models/Education");
const WorkExperience_1 = require("../../domain/models/WorkExperience");
const Resume_1 = require("../../domain/models/Resume");
const Application_1 = require("../../domain/models/Application");
const addCandidate = async (candidateData) => {
    try {
        (0, validator_1.validateCandidateData)(candidateData); // Validar los datos del candidato
    }
    catch (error) {
        throw new Error(error);
    }
    const candidate = new Candidate_1.Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado
        // Guardar la educación del candidato
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                const educationModel = new Education_1.Education(education);
                educationModel.candidateId = candidateId;
                await educationModel.save();
                candidate.educations.push(educationModel);
            }
        }
        // Guardar la experiencia laboral del candidato
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                const experienceModel = new WorkExperience_1.WorkExperience(experience);
                experienceModel.candidateId = candidateId;
                await experienceModel.save();
                candidate.workExperiences.push(experienceModel);
            }
        }
        // Guardar los archivos de CV
        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            const resumeModel = new Resume_1.Resume(candidateData.cv);
            resumeModel.candidateId = candidateId;
            await resumeModel.save();
            candidate.resumes.push(resumeModel);
        }
        return savedCandidate;
    }
    catch (error) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        }
        else {
            throw error;
        }
    }
};
exports.addCandidate = addCandidate;
const findCandidateById = async (id) => {
    try {
        const candidate = await Candidate_1.Candidate.findOne(id); // Cambio aquí: pasar directamente el id
        return candidate;
    }
    catch (error) {
        console.error('Error al buscar el candidato:', error);
        throw new Error('Error al recuperar el candidato');
    }
};
exports.findCandidateById = findCandidateById;
const updateCandidateStage = async (id, applicationIdNumber, currentInterviewStep) => {
    try {
        const application = await Application_1.Application.findOneByPositionCandidateId(applicationIdNumber, id);
        if (!application) {
            throw new Error('Application not found');
        }
        // Actualizar solo la etapa de la entrevista actual de la aplicación específica
        application.currentInterviewStep = currentInterviewStep;
        // Guardar la aplicación actualizada
        await application.save();
        return application;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.updateCandidateStage = updateCandidateStage;
