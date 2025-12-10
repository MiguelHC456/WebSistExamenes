// routes/authRoutes.js

const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");

const { registrarUsuario, login, renewToken } = require("../controllers/authController");

const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

// ==================
//       TEST
// ==================
router.get("/test", (req, res) => {
    res.json({ ok: true, msg: "Auth Router Funciona" });
});

// ================================
//   CREAR ADMIN (solo una vez)
//   Protegido por seguridad
// ================================
router.post(
    "/create-admin",
    auth,
    requireRole("ADMIN"),
    async (req, res) => {
        try {
            const existe = await Usuario.findOne({ correo: "admin@mail.com" });

            if (existe) {
                return res.json({ msg: "El admin ya existe" });
            }

            const hashed = bcrypt.hashSync("123456", 10);

            const admin = await Usuario.create({
                nombre_completo: "Administrador",
                correo: "admin@mail.com",
                password: hashed,
                rol: "ADMIN",
                activo: true
            });

            res.json({ msg: "Admin creado", admin });

        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Error creando admin" });
        }
    }
);

// ================================
//   FIX PASSWORD ADMIN
//   (protección obligatoria)
// ================================
router.post(
    "/fix-pass",
    auth,
    requireRole("ADMIN"),
    async (req, res) => {
        try {
            const admin = await Usuario.findOne({ correo: "admin@mail.com" });

            if (!admin) {
                return res.status(404).json({ msg: "Admin no encontrado" });
            }

            const hashed = bcrypt.hashSync("123456", 10);
            admin.password = hashed;
            await admin.save();

            res.json({
                msg: "Password actualizado correctamente",
                password_hash: hashed
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Error fix-pass" });
        }
    }
);

// ==================
//      LOGIN
// ==================
router.post("/login", login);

// ===============================
//  REGISTER SOLO PARA ADMIN
// ===============================
router.post(
    "/register",
    auth,
    requireRole("ADMIN"),
    registrarUsuario
);

// ===============================
//    RENEW TOKEN (JWT)
// ===============================
router.get(
    "/renew",
    auth,
    renewToken
);

module.exports = router;

