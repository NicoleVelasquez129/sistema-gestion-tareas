const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Base de datos simulada en memoria (puedes reemplazarla con tu conexión a MySQL/PostgreSQL)
let tareas = [
  { id: 1, titulo: 'Diseñar interfaz', completada: false },
  { id: 2, titulo: 'Configurar repositorio', completada: true }
];

// 1. VISUALIZAR todas las tareas (GET)
app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});

// 2. REGISTRAR una nueva tarea (POST)
app.post('/api/tareas', (req, res) => {
  const { titulo } = req.body;
  if (!titulo) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  const nuevaTarea = {
    id: Date.now(),
    titulo,
    completada: false
  };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// 3. COMPLETAR/ACTUALIZAR una tarea (PUT)
app.put('/api/tareas/:id', (req, res) => {
  const { id } = req.params;
  const tarea = tareas.find(t => t.id == id);
  
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  tarea.completada = req.body.completada !== undefined ? req.body.completada : !tarea.completada;
  res.json(tarea);
});

// 4. ELIMINAR una tarea (DELETE)
app.delete('/api/tareas/:id', (req, res) => {
  const { id } = req.params;
  tareas = tareas.filter(t => t.id != id);
  res.json({ message: 'Tarea eliminada correctamente' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});