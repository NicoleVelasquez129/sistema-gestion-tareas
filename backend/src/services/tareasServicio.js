// Servicio de tareas: contiene la lógica de negocio (validar, armar los datos,
// decidir qué error devolver). No sabe nada de HTTP ni de la base de datos.

const repositorio = require('../repositories/tareasRepositorio');
const { validarTarea, PRIORIDADES } = require('../utils/validaciones');
const ErrorApi = require('../utils/ErrorApi');

// Convierte el id recibido en la URL a número y verifica que sea válido
function convertirId(idTexto) {
  const id = Number(idTexto);
  if (!Number.isInteger(id) || id <= 0) {
    throw ErrorApi.solicitudIncorrecta('El id debe ser un número entero positivo');
  }
  return id;
}

// Toma solo los campos permitidos (ignora cualquier otro que envíe el cliente)
function extraerCampos(datos) {
  const campos = {};
  if (datos.titulo !== undefined) campos.titulo = datos.titulo.trim();
  if (datos.descripcion !== undefined) campos.descripcion = datos.descripcion ?? '';
  if (datos.prioridad !== undefined) campos.prioridad = datos.prioridad;
  if (datos.fecha !== undefined) campos.fecha = datos.fecha || null; // "" se guarda como null
  if (datos.completada !== undefined) campos.completada = datos.completada;
  return campos;
}

async function listar(filtros) {
  const { completada, prioridad } = filtros;
  const filtrosLimpios = {};

  // En la URL los valores llegan como texto: "true" / "false"
  if (completada !== undefined) {
    if (completada !== 'true' && completada !== 'false') {
      throw ErrorApi.solicitudIncorrecta('Filtro "completada" inválido. Use: true o false');
    }
    filtrosLimpios.completada = completada === 'true';
  }

  if (prioridad !== undefined) {
    if (!PRIORIDADES.includes(prioridad)) {
      throw ErrorApi.solicitudIncorrecta(`Filtro "prioridad" inválido. Use: ${PRIORIDADES.join(', ')}`);
    }
    filtrosLimpios.prioridad = prioridad;
  }

  return repositorio.obtenerTodas(filtrosLimpios);
}

async function obtener(idTexto) {
  const id = convertirId(idTexto);
  const tarea = await repositorio.obtenerPorId(id);
  if (!tarea) throw ErrorApi.noEncontrado(`No existe la tarea con id ${id}`);
  return tarea;
}

async function crear(datos) {
  const errores = validarTarea(datos);
  if (errores.length > 0) throw ErrorApi.solicitudIncorrecta('Datos inválidos', errores);

  // Valores por defecto para los campos opcionales
  const nuevaTarea = {
    descripcion: '',
    prioridad: 'media',
    fecha: null,
    completada: false,
    ...extraerCampos(datos),
  };

  return repositorio.crear(nuevaTarea);
}

async function actualizar(idTexto, datos) {
  const id = convertirId(idTexto);

  const errores = validarTarea(datos, true);
  if (errores.length > 0) throw ErrorApi.solicitudIncorrecta('Datos inválidos', errores);

  const cambios = extraerCampos(datos);
  if (Object.keys(cambios).length === 0) {
    throw ErrorApi.solicitudIncorrecta('No se envió ningún campo para actualizar');
  }

  const tarea = await repositorio.actualizar(id, cambios);
  if (!tarea) throw ErrorApi.noEncontrado(`No existe la tarea con id ${id}`);
  return tarea;
}

async function eliminar(idTexto) {
  const id = convertirId(idTexto);
  const eliminada = await repositorio.eliminar(id);
  if (!eliminada) throw ErrorApi.noEncontrado(`No existe la tarea con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
