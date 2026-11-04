// Reglas de validación para las tareas.
// Los nombres de los campos coinciden con los que usa el frontend (index.html):
// titulo, descripcion, prioridad, fecha y completada.
// Si el equipo cambia las prioridades permitidas, se modifican aquí.

const PRIORIDADES = ['baja', 'media', 'alta'];

const LARGO_MAX_TITULO = 100;
const LARGO_MAX_DESCRIPCION = 1000;

/**
 * Valida los datos de una tarea.
 * @param {object} datos - Cuerpo recibido en la petición
 * @param {boolean} parcial - true en actualizaciones: los campos son opcionales
 * @returns {Array<string>} lista de errores (vacía si todo está bien)
 */
function validarTarea(datos, parcial = false) {
  const errores = [];

  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return ['El cuerpo de la petición debe ser un objeto JSON'];
  }

  const { titulo, descripcion, prioridad, fecha, completada } = datos;

  // Título: obligatorio al crear
  if (titulo === undefined) {
    if (!parcial) errores.push('El campo "titulo" es obligatorio');
  } else if (typeof titulo !== 'string' || titulo.trim() === '') {
    errores.push('El campo "titulo" debe ser un texto no vacío');
  } else if (titulo.trim().length > LARGO_MAX_TITULO) {
    errores.push(`El campo "titulo" no puede superar ${LARGO_MAX_TITULO} caracteres`);
  }

  // Descripción: opcional
  if (descripcion !== undefined && descripcion !== null) {
    if (typeof descripcion !== 'string') {
      errores.push('El campo "descripcion" debe ser texto');
    } else if (descripcion.length > LARGO_MAX_DESCRIPCION) {
      errores.push(`El campo "descripcion" no puede superar ${LARGO_MAX_DESCRIPCION} caracteres`);
    }
  }

  // Prioridad: opcional, pero debe ser una de las permitidas
  if (prioridad !== undefined && !PRIORIDADES.includes(prioridad)) {
    errores.push(`El campo "prioridad" debe ser una de: ${PRIORIDADES.join(', ')}`);
  }

  // Fecha límite: opcional, formato AAAA-MM-DD.
  // Se acepta "" o null como "sin fecha" (el input date del frontend envía "" si está vacío).
  if (fecha !== undefined && fecha !== null && fecha !== '') {
    const formatoValido = typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha);
    if (!formatoValido || Number.isNaN(Date.parse(fecha))) {
      errores.push('El campo "fecha" debe tener el formato AAAA-MM-DD');
    }
  }

  // Completada: opcional, debe ser true o false
  if (completada !== undefined && typeof completada !== 'boolean') {
    errores.push('El campo "completada" debe ser true o false');
  }

  return errores;
}

module.exports = { validarTarea, PRIORIDADES };
