"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const candidateRoutes_1 = __importDefault(require("./routes/candidateRoutes"));
const positionRoutes_1 = __importDefault(require("./routes/positionRoutes"));
const fileUploadService_1 = require("./application/services/fileUploadService");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
exports.app = (0, express_1.default)();
exports.default = exports.app;
// Middleware para parsear JSON. Asegúrate de que esto esté antes de tus rutas.
exports.app.use(express_1.default.json());
// Middleware para adjuntar prisma al objeto de solicitud
exports.app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});
// Middleware para permitir CORS desde http://localhost:3000
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
// Import and use candidateRoutes
exports.app.use('/candidates', candidateRoutes_1.default);
// Route for file uploads
exports.app.post('/upload', fileUploadService_1.uploadFile);
// Route to get candidates by position
exports.app.use('/position', positionRoutes_1.default);
exports.app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
const port = 3010;
exports.app.get('/', (req, res) => {
    res.send('Hola LTI!');
});
exports.app.use((err, req, res, next) => {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500).send('Something broke!');
});
exports.app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
