require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const nivelDificultadRoutes = require('./routes/nivelDificultadRoutes');
const NivelDificultad = require('./models/NivelDificultad');
const categoriaRoutes = require('./routes/categoriaRoutes');
//const Categoria = require('./models/Categorias');//aumente esta, pero no se usa

const app = express();
app.use(express.json());

// Rutas
app.use('/api/niveles-dificultad', nivelDificultadRoutes);
app.use('/api/categorias', categoriaRoutes);


app.get('/niveles', async (req, res) => {
  try {
    const niveles = await NivelDificultad.find({}).sort({ nivel: 1 });
    res.json(niveles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/ping', (req, res) => {
  res.json({ ok: true, mensaje: 'Servidor responde /ping' });
});

// Seed inicial
async function poblarDatosIniciales() {
  const existentes = await NivelDificultad.find({});
  if (existentes.length === 0) {
    console.log("Insertando datos iniciales (Atlas)...");
    await NivelDificultad.insertMany([
      { nivel: "Fácil", descripcion: "Para niños", activo: true, creado_por: new mongoose.Types.ObjectId() },
      { nivel: "Medio", descripcion: "Nivel intermedio", activo: true, creado_por: new mongoose.Types.ObjectId() },
      { nivel: "Difícil", descripcion: "Para avanzados", activo: true, creado_por: new mongoose.Types.ObjectId() }
    ]);
    console.log("Seed completado en Atlas");
  }
}

async function iniciarServidor() {
  const uri = process.env.MONGODB_URI;

  console.log("Conectando a MongoDB Atlas...");
  await mongoose.connect(uri);

  console.log("Conectado a MongoDB Atlas");

  await poblarDatosIniciales();
}

const PORT = process.env.PORT || 3000;

iniciarServidor().then(() => {
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
});

