// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const app = express();

// ===============================
//     VALIDACIÓN DE VARIABLES
// ===============================
if (!process.env.MONGODB_URI) {
  console.error("❌ ERROR: Falta MONGODB_URI en .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: Falta JWT_SECRET en .env");
  process.exit(1);
}

// ===============================
//          MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===============================
//             RUTAS
// ===============================
console.log(">>> Cargando rutas...");

// AUTH
app.use("/api/auth", require("./routes/authRoutes"));
console.log(">>> authRoutes CARGADO");

// USUARIOS
console.log(">>> require.resolve usuarioRoutes:", require.resolve("./routes/usuarioRoutes"));
app.use("/api/usuarios", require("./routes/usuarioRoutes"));

// RESTO DE RUTAS
app.use("/api/categorias", require("./routes/categoriaRoutes"));
app.use("/api/subcategorias", require("./routes/subcategoriaRoutes"));
app.use("/api/rangos-edad", require("./routes/rangoEdadRoutes"));
app.use("/api/preguntas", require("./routes/preguntaRoutes"));
app.use("/api/niveles-dificultad", require("./routes/nivelDificultadRoutes"));
app.use("/api/estados-pregunta", require("./routes/estadoPreguntaRoutes"));

// ===============================
//        RUTA TEST GLOBAL
// ===============================
app.get("/test-server", (req, res) => {
  res.json({ ok: true, msg: "Servidor funcionando correctamente" });
});

// ===============================
//   MANEJO DE RUTAS INEXISTENTES
// ===============================
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Ruta no encontrada" });
});

// ===============================
//     CONFIGURACIÓN HTTPS
// ===============================
let httpsOptions = {};
try {
  httpsOptions = {
    key: fs.readFileSync("./certs/cert-key.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
    //ca: fs.readFileSync("./certs/ca.pem"),
  };
  console.log("🔐 Certificados HTTPS cargados correctamente.");
} catch (err) {
  console.warn("⚠ No se pudieron cargar certificados HTTPS:", err.message);
  console.warn("⚠ HTTPS NO se habilitará. Solo se usará HTTP.");
}

// ===============================
//   CONEXIÓN A MONGO + SERVIDORES
// ===============================
async function startServer() {
  try {
    console.log("Conectando a MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✔ Conectado a MongoDB Atlas");

    // Puertos
    const HTTP_PORT = process.env.HTTP_PORT || 3001;
    const HTTPS_PORT = process.env.HTTPS_PORT || 3000;

    // Servidor HTTP
    app.listen(HTTP_PORT, () => {
      console.log(`🌐 Servidor HTTP corriendo en http://localhost:${HTTP_PORT}`);
    });

    // Servidor HTTPS (si existen certificados)
    if (httpsOptions.key) {
      https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
        console.log(`🔐 Servidor HTTPS corriendo en https://localhost:${HTTPS_PORT}`);
      });
    }

  } catch (error) {
    console.error("❌ ERROR DE CONEXIÓN MONGO:", error);
    process.exit(1);
  }
}

startServer();

