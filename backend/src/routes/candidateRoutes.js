"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const candidateController_1 = require("../presentation/controllers/candidateController");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        // console.log(req.body); //Just in case you want to inspect the request body
        const result = await (0, candidateController_1.addCandidate)(req.body);
        res.status(201).send(result);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({ message: error.message });
        }
        else {
            res.status(500).send({ message: "An unexpected error occurred" });
        }
    }
});
router.get('/:id', candidateController_1.getCandidateById);
router.put('/:id', candidateController_1.updateCandidateStageController);
exports.default = router;
