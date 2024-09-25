"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCandidate = exports.updateCandidateStageController = exports.getCandidateById = exports.addCandidateController = void 0;
const candidateService_1 = require("../../application/services/candidateService");
Object.defineProperty(exports, "addCandidate", { enumerable: true, get: function () { return candidateService_1.addCandidate; } });
const addCandidateController = async (req, res) => {
    try {
        const candidateData = req.body;
        const candidate = await (0, candidateService_1.addCandidate)(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        }
        else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};
exports.addCandidateController = addCandidateController;
const getCandidateById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await (0, candidateService_1.findCandidateById)(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getCandidateById = getCandidateById;
const updateCandidateStageController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { applicationId, currentInterviewStep } = req.body;
        const applicationIdNumber = parseInt(applicationId);
        if (isNaN(applicationIdNumber)) {
            return res.status(400).json({ error: 'Invalid position ID format' });
        }
        const currentInterviewStepNumber = parseInt(currentInterviewStep);
        if (isNaN(currentInterviewStepNumber)) {
            return res.status(400).json({ error: 'Invalid currentInterviewStep format' });
        }
        const updatedCandidate = await (0, candidateService_1.updateCandidateStage)(id, applicationIdNumber, currentInterviewStepNumber);
        res.status(200).json({ message: 'Candidate stage updated successfully', data: updatedCandidate });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Error: Application not found') {
                res.status(404).json({ message: 'Application not found', error: error.message });
            }
            else {
                res.status(400).json({ message: 'Error updating candidate stage', error: error.message });
            }
        }
        else {
            res.status(500).json({ message: 'Error updating candidate stage', error: 'Unknown error' });
        }
    }
};
exports.updateCandidateStageController = updateCandidateStageController;
