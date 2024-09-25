"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB
    },
    fileFilter: fileFilter
});
const uploadFile = (req, res) => {
    const uploader = upload.single('file');
    uploader(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            // Manejo de errores específicos de Multer
            return res.status(500).json({ error: err.message });
        }
        else if (err) {
            // Otros errores posibles
            return res.status(500).json({ error: err.message });
        }
        // Verificar si el archivo fue rechazado por el filtro de archivos
        if (!req.file) {
            return res.status(400).json({ error: 'Invalid file type, only PDF and DOCX are allowed!' });
        }
        // Si todo está bien, proceder a responder con la ruta del archivo y el tipo de archivo
        res.status(200).json({
            filePath: req.file.path,
            fileType: req.file.mimetype // Aquí se añade el tipo de archivo
        });
    });
};
exports.uploadFile = uploadFile;
