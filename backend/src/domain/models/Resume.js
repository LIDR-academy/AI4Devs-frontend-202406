"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resume = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Resume {
    constructor(data) {
        this.id = data?.id;
        this.candidateId = data?.candidateId;
        this.filePath = data?.filePath;
        this.fileType = data?.fileType;
        this.uploadDate = new Date();
    }
    async save() {
        if (!this.id) {
            return await this.create();
        }
        throw new Error('No se permite la actualización de un currículum existente.');
    }
    async create() {
        console.log(this);
        const createdResume = await prisma.resume.create({
            data: {
                candidateId: this.candidateId,
                filePath: this.filePath,
                fileType: this.fileType,
                uploadDate: this.uploadDate
            },
        });
        return new Resume(createdResume);
    }
}
exports.Resume = Resume;
