const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const nivelDificultadRoutes = require('./routes/nivelDificultadRoutes');

// IMPORTANTE: importar el modelo antes de usarlo
const NivelDificultad = require('./models/NivelDificultad');

const app = express();

app.use(express.json());

// Rutas
app.use('/api/niveles-dificultad', nivelDificultadRoutes);

// Ruta de prueba para ver niveles cargados
app.get('/niveles', async (req, res) => {
  try {
    const niveles = await NivelDificultad.find({});
    res.json(niveles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Función para seed simple
async function poblarDatosIniciales() {
  const existentes = await NivelDificultad.find({});
  
  if (existentes.length === 0) {
    console.log('🌱 Insertando datos iniciales...');

    await NivelDificultad.insertMany([
      { nivel: 'Muy Fácil', descripcion: 'Para 5-8 años', creado_por: new mongoose.Types.ObjectId() },
      { nivel: 'Fácil', descripcion: 'Para 9-11 años', creado_por: new mongoose.Types.ObjectId() },
      { nivel: 'Medio', descripcion: 'Para 12-14 años', creado_por: new mongoose.Types.ObjectId() },
      { nivel: 'Difícil', descripcion: 'Para 15-17 años', creado_por: new mongoose.Types.ObjectId() },
      { nivel: 'Muy Difícil', descripcion: 'Para 18+ años', creado_por: new mongoose.Types.ObjectId() }
    ]);
    const todos = await NivelDificultad.find({});
console.log('Todos los niveles en DB:', todos);

    console.log('✅ Datos iniciales insertados');
  }
}

async function iniciarServidor() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);
  console.log('✅ Conectado a MongoDB en memoria');

  await poblarDatosIniciales();

  global.__MONGOD = mongod;
}

const PORT = 3000;

iniciarServidor().then(() => {
  app.listen(PORT, () => {
    console.log(`🎯 Servidor en http://localhost:${PORT}`);
  });
});
