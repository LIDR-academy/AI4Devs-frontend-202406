"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterviewFlowByPosition = exports.getCandidatesByPosition = void 0;
const positionService_1 = require("../../application/services/positionService");
const getCandidatesByPosition = async (req, res) => {
    try {
        const positionId = parseInt(req.params.id);
        const candidates = await (0, positionService_1.getCandidatesByPositionService)(positionId);
        res.status(200).json(candidates);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error retrieving candidates', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Error retrieving candidates', error: String(error) });
        }
    }
};
exports.getCandidatesByPosition = getCandidatesByPosition;
const getInterviewFlowByPosition = async (req, res) => {
    try {
        const positionId = parseInt(req.params.id);
        const interviewFlow = await (0, positionService_1.getInterviewFlowByPositionService)(positionId);
        res.status(200).json({ interviewFlow });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: 'Position not found', error: error.message });
        }
        else {
            res.status(500).json({ message: 'Server error', error: String(error) });
        }
    }
};
exports.getInterviewFlowByPosition = getInterviewFlowByPosition;
