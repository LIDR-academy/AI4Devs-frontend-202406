"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Employee {
    constructor(data) {
        this.id = data.id;
        this.companyId = data.companyId;
        this.name = data.name;
        this.email = data.email;
        this.role = data.role;
        this.isActive = data.isActive ?? true;
    }
    async save() {
        const employeeData = {
            companyId: this.companyId,
            name: this.name,
            email: this.email,
            role: this.role,
            isActive: this.isActive,
        };
        if (this.id) {
            return await prisma.employee.update({
                where: { id: this.id },
                data: employeeData,
            });
        }
        else {
            return await prisma.employee.create({
                data: employeeData,
            });
        }
    }
    static async findOne(id) {
        const data = await prisma.employee.findUnique({
            where: { id: id },
        });
        if (!data)
            return null;
        return new Employee(data);
    }
}
exports.Employee = Employee;
