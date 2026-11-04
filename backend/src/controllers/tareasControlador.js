// Controlador de tareas: recibe la petición HTTP, llama al servicio
// y responde con el código de estado y el JSON adecuados.
// Express 5 envía automáticamente los errores de funciones async al middleware de errores.

const servicio = require('../services/tareasServicio');

// GET /api/tareas?completada=true|false&prioridad=...
async function listar(req, res) {
  const tareas = await servicio.listar(req.query);
  res.json(tareas);
}

// GET /api/tareas/:id
async function obtener(req, res) {
  const tarea = await servicio.obtener(req.params.id);
  res.json(tarea);
}

// POST /api/tareas
async function crear(req, res) {
  const tarea = await servicio.crear(req.body);
  res.status(201).json(tarea);
}

// PUT /api/tareas/:id  (actualiza solo los campos enviados)
async function actualizar(req, res) {
  const tarea = await servicio.actualizar(req.params.id, req.body);
  res.json(tarea);
}

// DELETE /api/tareas/:id
async function eliminar(req, res) {
  await servicio.eliminar(req.params.id);
  res.status(204).send();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
