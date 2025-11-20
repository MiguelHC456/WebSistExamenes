require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const nivelDificultadRoutes = require("./routes/nivelDificultadRoutes");
const NivelDificultad = require("./models/NivelDificultad");

const app = express();
app.use(express.json());

// Rutas
app.use("/api/niveles-dificultad", nivelDificultadRoutes);

// Ruta de prueba
app.get("/niveles", async (req, res) => {
  try {
    const niveles = await NivelDificultad.find({}).sort({ nivel: 1 });
    res.json(niveles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed inicial
async function poblarDatosIniciales() {
  const existentes = await NivelDificultad.find({});
  if (existentes.length === 0) {
    console.log("🌱 Insertando datos iniciales en Atlas...");
    await NivelDificultad.insertMany([
      {
        nivel: "Fácil",
        descripcion: "Para niños",
        activo: true,
        creado_por: new mongoose.Types.ObjectId(),
      },
      {
        nivel: "Medio",
        descripcion: "Nivel intermedio",
        activo: true,
        creado_por: new mongoose.Types.ObjectId(),
      },
      {
        nivel: "Difícil",
        descripcion: "Para avanzados",
        activo: true,
        creado_por: new mongoose.Types.ObjectId(),
      },
    ]);
    console.log("✅ Seed completado en Atlas");
  }
}

// Conexión principal
async function iniciarServidor() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ ERROR: No existe MONGODB_URI en el archivo .env");
    process.exit(1);
  }

  console.log("🔌 Conectando a MongoDB Atlas...");
  await mongoose.connect(uri);

  console.log("🚀 Conectado a MongoDB Atlas");

  await poblarDatosIniciales();
}

const PORT = process.env.PORT || 3000;

iniciarServidor().then(() => {
  app.listen(PORT, () =>
    console.log(`🎯 Servidor corriendo en http://localhost:${PORT}`)
  );
});

