const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Base de datos temporal en memoria (simulando tareas)
let tareas = [
    { id: 1, titulo: 'Estudiar Git y GitHub', completada: false },
    { id: 2, titulo: 'Configurar entorno en Arch Linux', completada: true }
];

// 1. READ: Obtener todas las tareas
app.get('/api/tareas', (req, res) => {
    res.json(tareas);
});

// 2. CREATE: Agregar una nueva tarea
app.post('/api/tareas', (req, res) => {
    const nuevaTarea = {
        id: tareas.length > 0 ? tareas[tareas.length - 1].id + 1 : 1,
        titulo: req.body.titulo,
        completada: false
    };
    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// 3. UPDATE: Actualizar / Marcar tarea como completada
app.put('/api/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    tarea.titulo = req.body.titulo !== undefined ? req.body.titulo : tarea.titulo;
    tarea.completada = req.body.completada !== undefined ? req.body.completada : tarea.completada;

    res.json(tarea);
});

// 4. DELETE: Eliminar una tarea
app.delete('/api/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tareas.findIndex(t => t.id === id);

    if (index === -1) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    const tareaEliminada = tareas.splice(index, 1);
    res.json(tareaEliminada);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
