// routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

// GET /api/categorias
router.get('/', categoriaController.obtenerCategorias);

// POST /api/categorias
router.post('/', categoriaController.crearCategoria);

module.exports = router;
