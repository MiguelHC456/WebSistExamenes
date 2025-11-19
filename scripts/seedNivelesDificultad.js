const mongoose = require('mongoose');
const NivelDificultad = require('../models/NivelDificultad');

const nivelesIniciales = [
  {
    nivel: 'Muy Fácil',
    description: 'Preguntas básicas para principiantes o edades tempranas (5-7 años)',
    activo: true
  },
  {
    nivel: 'Fácil',
    description: 'Preguntas sencillas para estudiantes con conocimientos básicos (8-10 años)',
    activo: true
  },
  {
    nivel: 'Medio',
    description: 'Preguntas de dificultad intermedia para estudiantes regularizados (11-14 años)',
    activo: true
  },
  {
    nivel: 'Difícil',
    description: 'Preguntas complejas para estudiantes avanzados (15-17 años)',
    activo: true
  },
  {
    nivel: 'Muy Difícil',
    description: 'Preguntas expertas para nivel universitario o competencias de alto nivel',
    activo: true
  }
];

// Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Conectado a MongoDB');
  
  // Limpiar la colección existente
  await NivelDificultad.deleteMany({});
  console.log('Colección de niveles de dificultad limpiada');
  
  // Insertar los niveles iniciales
  await NivelDificultad.insertMany(nivelesIniciales);
  console.log('Niveles de dificultad insertados correctamente');
  
  // Cerrar la conexión
  mongoose.connection.close();
  console.log('Conexión cerrada');
})
.catch(err => {
  console.error('Error:', err);
  mongoose.connection.close();
});