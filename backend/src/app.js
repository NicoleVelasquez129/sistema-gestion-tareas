// Configuración de la aplicación Express (middlewares y rutas).
// Se separa de server.js para poder probar la app sin levantar el servidor.

const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const tareasRutas = require('./routes/tareasRutas');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/manejoErrores');

const app = express();

// Permite que el frontend (otro origen/puerto) consuma la API
app.use(cors({ origin: config.origenCors }));

// Permite leer cuerpos JSON en las peticiones
app.use(express.json());

// Ruta para verificar que el servidor está funcionando
app.get('/api/salud', (req, res) => {
  res.json({ estado: 'ok', fecha: new Date().toISOString() });
});

// Rutas principales
app.use('/api/tareas', tareasRutas);

// Manejo de rutas inexistentes y errores (siempre al final)
app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;
