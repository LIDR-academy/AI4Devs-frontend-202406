"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Company {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
    async save() {
        const companyData = {
            name: this.name,
        };
        if (this.id) {
            return await prisma.company.update({
                where: { id: this.id },
                data: companyData,
            });
        }
        else {
            return await prisma.company.create({
                data: companyData,
            });
        }
    }
    static async findOne(id) {
        const data = await prisma.company.findUnique({
            where: { id: id },
        });
        if (!data)
            return null;
        return new Company(data);
    }
}
exports.Company = Company;
