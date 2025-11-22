const Categoria = require('../models/Categoria');

exports.obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find({ activo: true }).sort({ nombre: 1 });

        res.json({
            success: true,
            data: categorias,
            total: categorias.length
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        const nuevaCategoria = new Categoria({
            nombre,
            descripcion,
            creado_por: "507f1f77bcf86cd799439011" // por ahora un ID fijo
        });

        const guardada = await nuevaCategoria.save();

        res.status(201).json({
            success: true,
            data: guardada,
            message: "Categoría creada exitosamente"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
