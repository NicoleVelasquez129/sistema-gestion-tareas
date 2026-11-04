// Repositorio de tareas: es la ÚNICA capa que toca el almacenamiento de datos.
//
// Por ahora guarda las tareas EN MEMORIA (se pierden al reiniciar el servidor)
// porque el equipo de base de datos todavía no ha definido el motor.
// Cuando la base de datos esté lista, solo hay que reescribir este archivo
// manteniendo las mismas funciones; el resto del backend no cambia.

let tareas = [];
let siguienteId = 1;

async function obtenerTodas(filtros = {}) {
  return tareas.filter((tarea) => {
    if (filtros.completada !== undefined && tarea.completada !== filtros.completada) return false;
    if (filtros.prioridad && tarea.prioridad !== filtros.prioridad) return false;
    return true;
  });
}

async function obtenerPorId(id) {
  return tareas.find((tarea) => tarea.id === id) || null;
}

async function crear(datos) {
  const ahora = new Date().toISOString();
  const nuevaTarea = {
    id: siguienteId++,
    ...datos,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };
  tareas.push(nuevaTarea);
  return nuevaTarea;
}

async function actualizar(id, cambios) {
  const indice = tareas.findIndex((tarea) => tarea.id === id);
  if (indice === -1) return null;

  tareas[indice] = {
    ...tareas[indice],
    ...cambios,
    id, // el id nunca se modifica
    actualizadoEn: new Date().toISOString(),
  };
  return tareas[indice];
}

async function eliminar(id) {
  const largoAnterior = tareas.length;
  tareas = tareas.filter((tarea) => tarea.id !== id);
  return tareas.length < largoAnterior;
}

// Solo se usa en las pruebas para empezar con datos limpios
function reiniciar() {
  tareas = [];
  siguienteId = 1;
}

module.exports = { obtenerTodas, obtenerPorId, crear, actualizar, eliminar, reiniciar };
