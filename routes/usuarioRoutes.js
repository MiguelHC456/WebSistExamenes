// routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

// =====================================================
//   RUTAS ESPECÍFICAS (con texto)
// =====================================================

//  DEBUG PASS (Debe ir primero)
router.get("/debug-pass/:id", async (req, res) => {
    try {
        const usr = await Usuario.findById(req.params.id).select("+password");
        if (!usr) return res.status(404).json({ msg: "Usuario no encontrado" });
        res.json(usr);
    } catch (error) {
        console.error("Error debug-pass:", error);
        res.status(500).json({ msg: "Error en debug-pass" });
    }
});

// =====================================================
//  GET /api/usuarios        → listar todos (ADMIN)
// =====================================================
router.get("/", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const usuarios = await Usuario.find().select("-password");
        res.json(usuarios);
    } catch (error) {
        console.error("Error GET usuarios:", error);
        res.status(500).json({ msg: "Error al obtener usuarios" });
    }
});

// =====================================================
//  POST /api/usuarios       → crear usuario
// =====================================================
router.post("/", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { correo, nombre_completo, password, rol } = req.body;

        if (!correo || !nombre_completo || !password || !rol) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        const ROLES_VALIDOS = ["ADMIN", "PROF_EDITOR", "PROFESOR", "ESTUDIANTE"];
        if (!ROLES_VALIDOS.includes(rol)) {
            return res.status(400).json({ msg: "Rol inválido" });
        }

        const existe = await Usuario.findOne({ correo });
        if (existe) return res.status(400).json({ msg: "El correo ya está registrado" });

        const hashed = bcrypt.hashSync(password, 10);

        const nuevoUsuario = new Usuario({
            correo,
            nombre_completo,
            password: hashed,
            rol,
            activo: true
        });

        await nuevoUsuario.save();

        res.json({
            msg: "Usuario creado correctamente",
            usuario: {
                id: nuevoUsuario._id,
                correo,
                nombre_completo,
                rol,
                activo: true
            }
        });

    } catch (error) {
        console.error("Error POST usuarios:", error);
        res.status(500).json({ msg: "Error al crear usuario" });
    }
});

// --- RUTAS PARAMÉTRICAS POR ID AGRUPADAS ---

// =====================================================
//  GET /api/usuarios/:id    → obtener usuario por ID
// =====================================================
router.get("/:id", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-password");
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
        res.json(usuario);
    } catch (error) {
        console.error("Error GET usuario por ID:", error);
        res.status(500).json({ msg: "Error al obtener el usuario" });
    }
});

// =====================================================
//  PUT /api/usuarios/:id    → actualizar usuario
// =====================================================
router.put("/:id", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { nombre_completo, correo, rol, activo } = req.body;

        const updates = {};
        if (nombre_completo) updates.nombre_completo = nombre_completo;
        if (correo) updates.correo = correo;
        if (rol) updates.rol = rol;
        if (activo !== undefined) updates.activo = activo;

        // ❗ Nunca actualizar password aquí
        delete updates.password;

        const 
        uario = await Usuario.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).select("-password");

        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({
            msg: "Usuario actualizado correctamente",
            usuario
        });

    } catch (error) {
        console.error("Error PUT usuarios:", error);
        res.status(500).json({ msg: "Error al actualizar usuario" });
    }
});

// =====================================================
//  DELETE /api/usuarios/:id  → desactivar usuario
// =====================================================
router.delete("/:id", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { activo: false },
            { new: true }
        ).select("-password");

        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({
            msg: "Usuario desactivado",
            usuario
        });

    } catch (error) {
        console.error("Error DELETE usuarios:", error);
        res.status(500).json({ msg: "Error al desactivar usuario" });
    }
});

// =====================================================
//  PATCH /api/usuarios/:id/rol → cambiar rol
// =====================================================
router.patch("/:id/rol", auth, requireRole("ADMIN"), async (req, res) => {
    try {
        const { rol } = req.body;

        const ROLES_VALIDOS = ["ADMIN", "PROF_EDITOR", "PROFESOR", "ESTUDIANTE"];
        if (!ROLES_VALIDOS.includes(rol)) {
            return res.status(400).json({ msg: "Rol inválido" });
        }

        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { rol },
            { new: true }
        ).select("-password");

        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({
            msg: "Rol actualizado correctamente",
            usuario
        });

    } catch (error) {
        console.error("Error PATCH usuarios:", error);
        res.status(500).json({ msg: "Error al actualizar rol" });
    }
});

module.exports = router;