// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const app = express();

// Validación de variables de entorno
if (!process.env.MONGODB_URI) {
  console.error("ERROR: Falta MONGODB_URI en .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("ERROR: Falta JWT_SECRET en .env");
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Carga de rutas
app.use("/api/categorias", require("./routes/categoriaRoutes"));
app.use("/api/subcategorias", require("./routes/subcategoriaRoutes"));
app.use("/api/rangos-edad", require("./routes/rangoEdadRoutes"));
app.use("/api/preguntas", require("./routes/preguntaRoutes"));
app.use("/api/niveles-dificultad", require("./routes/nivelDificultadRoutes"));
app.use("/api/estados-pregunta", require("./routes/estadoPreguntaRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/usuarios", require("./routes/usuarioRoutes")); 

// Manejo de rutas inexistentes
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Ruta no encontrada" });
});

// Carga de certificados SSL
let sslOptions = {};
try {
  sslOptions = {
    key: fs.readFileSync("./certs/cert-key.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
  };
  console.log("Certificados cargados correctamente.");
} catch (err) {
  console.warn("Error cargando certificados:", err.message);
}

// Inicio de servidores
async function startServer() {
  try {
    console.log("Conectando a MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB Atlas");

    const HTTP_PORT = 3001;
    const HTTPS_PORT = 3000;

    // Servidor HTTP → accesible desde WSL y Nginx
    app.listen(HTTP_PORT, "0.0.0.0", () => {
      console.log(`HTTP  → http://localhost:${HTTP_PORT}`);
    });

    // Servidor HTTPS → accesible desde WSL y Nginx
    https.createServer(sslOptions, app).listen(HTTPS_PORT, "0.0.0.0", () => {
      console.log(`HTTPS → https://localhost:${HTTPS_PORT}`);
    });

  } catch (error) {
    console.error("ERROR DE CONEXIÓN MONGO:", error);
    process.exit(1);
  }
}

startServer();




