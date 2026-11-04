// Middlewares para manejar rutas inexistentes y errores de forma uniforme.
// Todas las respuestas de error tienen el formato: { error: "...", detalles: [...] }

const ErrorApi = require('../utils/ErrorApi');

// Se ejecuta cuando ninguna ruta coincide con la petición
function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// Atrapa cualquier error lanzado en rutas, controladores o servicios
// (Express lo reconoce como manejador de errores porque recibe 4 parámetros)
// eslint-disable-next-line no-unused-vars
function manejadorErrores(err, req, res, next) {
  // Errores esperados (validaciones, no encontrado, etc.)
  if (err instanceof ErrorApi) {
    const respuesta = { error: err.message };
    if (err.detalles.length > 0) respuesta.detalles = err.detalles;
    return res.status(err.estado).json(respuesta);
  }

  // JSON mal formado en el cuerpo de la petición
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }

  // Errores inesperados: se registran en consola y no se exponen al cliente
  console.error('Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { rutaNoEncontrada, manejadorErrores };
