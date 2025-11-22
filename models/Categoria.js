// models/Categoria.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    descripcion: {
        type: String,
        maxlength: 255
    },
    activo: {
        type: Boolean,
        default: true
    },
    creado_por: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, {
    timestamps: true // crea createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Categoria', categoriaSchema);
