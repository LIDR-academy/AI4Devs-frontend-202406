"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positionController_1 = require("../presentation/controllers/positionController");
const router = require('express').Router();
router.get('/:id/candidates', positionController_1.getCandidatesByPosition);
router.get('/:id/interviewflow', positionController_1.getInterviewFlowByPosition);
exports.default = router;
