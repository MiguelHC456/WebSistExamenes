const NivelDificultad = require('../models/NivelDificultad.js');

// Obtener todos los niveles de dificultad
exports.obtenerNivelesDificultad = async (req, res) => {
    try {
        const niveles = await NivelDificultad.find({}).sort({ nivel: 1 });

        res.json({
            success: true,
            data: niveles,
            total: niveles.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Crear nuevo nivel de dificultad
exports.crearNivelDificultad = async (req, res) => {
    try {
        const { nivel, descripcion } = req.body;
        
        const nuevoNivel = new NivelDificultad({
            nivel,
            descripcion,
            creado_por: "507f1f77bcf86cd799439011" // ID temporal
        });

        const nivelGuardado = await nuevoNivel.save();
        
        res.status(201).json({
            success: true,
            data: nivelGuardado,
            message: 'Nivel de dificultad creado exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener nivel por ID
exports.obtenerNivelDificultadPorId = async (req, res) => {
    try {
        const nivel = await NivelDificultad.findById(req.params.id);
        
        if (!nivel) {
            return res.status(404).json({
                success: false,
                message: 'Nivel de dificultad no encontrado'
            });
        }

        res.json({
            success: true,
            data: nivel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};