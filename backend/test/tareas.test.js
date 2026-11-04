// Pruebas automáticas de la API de tareas.
// Ejecutar con: npm test

const { test, beforeEach, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const repositorio = require('../src/repositories/tareasRepositorio');

let servidor;
let urlBase;

// Levanta el servidor en un puerto aleatorio antes de las pruebas
before(async () => {
  servidor = app.listen(0);
  await new Promise((resolver) => servidor.once('listening', resolver));
  urlBase = `http://localhost:${servidor.address().port}/api`;
});

after(() => servidor.close());

// Cada prueba empieza sin tareas
beforeEach(() => repositorio.reiniciar());

// Función auxiliar para hacer peticiones JSON
async function peticion(metodo, ruta, cuerpo) {
  const respuesta = await fetch(urlBase + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  });
  const texto = await respuesta.text();
  return { estado: respuesta.status, datos: texto ? JSON.parse(texto) : null };
}

test('GET /salud responde ok', async () => {
  const { estado, datos } = await peticion('GET', '/salud');
  assert.strictEqual(estado, 200);
  assert.strictEqual(datos.estado, 'ok');
});

test('crea una tarea con valores por defecto', async () => {
  const { estado, datos } = await peticion('POST', '/tareas', { titulo: '  Estudiar  ' });
  assert.strictEqual(estado, 201);
  assert.strictEqual(datos.id, 1);
  assert.strictEqual(datos.titulo, 'Estudiar');
  assert.strictEqual(datos.completada, false);
  assert.strictEqual(datos.prioridad, 'media');
  assert.strictEqual(datos.fecha, null);
});

test('rechaza crear una tarea sin título o con datos inválidos', async () => {
  const sinTitulo = await peticion('POST', '/tareas', {});
  assert.strictEqual(sinTitulo.estado, 400);

  const invalida = await peticion('POST', '/tareas', {
    titulo: 'X',
    completada: 'si',
    fecha: '04/11/2026',
  });
  assert.strictEqual(invalida.estado, 400);
  assert.strictEqual(invalida.datos.detalles.length, 2);
});

test('lista y filtra tareas', async () => {
  await peticion('POST', '/tareas', { titulo: 'A', prioridad: 'alta' });
  await peticion('POST', '/tareas', { titulo: 'B', prioridad: 'baja' });

  const todas = await peticion('GET', '/tareas');
  assert.strictEqual(todas.datos.length, 2);

  const altas = await peticion('GET', '/tareas?prioridad=alta');
  assert.strictEqual(altas.datos.length, 1);
  assert.strictEqual(altas.datos[0].titulo, 'A');

  await peticion('PUT', '/tareas/2', { completada: true });
  const completadas = await peticion('GET', '/tareas?completada=true');
  assert.strictEqual(completadas.datos.length, 1);
  assert.strictEqual(completadas.datos[0].titulo, 'B');

  const filtroInvalido = await peticion('GET', '/tareas?completada=xyz');
  assert.strictEqual(filtroInvalido.estado, 400);
});

test('acepta los datos tal como los envía el formulario del frontend', async () => {
  // El input de fecha vacío envía "" -> se guarda como null
  const sinFecha = await peticion('POST', '/tareas', {
    titulo: 'Desde el formulario',
    prioridad: 'alta',
    fecha: '',
  });
  assert.strictEqual(sinFecha.estado, 201);
  assert.strictEqual(sinFecha.datos.fecha, null);

  const conFecha = await peticion('POST', '/tareas', { titulo: 'Con fecha', fecha: '2026-11-20' });
  assert.strictEqual(conFecha.datos.fecha, '2026-11-20');
});

test('obtiene, actualiza y elimina una tarea', async () => {
  await peticion('POST', '/tareas', { titulo: 'Original' });

  const obtenida = await peticion('GET', '/tareas/1');
  assert.strictEqual(obtenida.estado, 200);

  const actualizada = await peticion('PUT', '/tareas/1', { completada: true });
  assert.strictEqual(actualizada.estado, 200);
  assert.strictEqual(actualizada.datos.completada, true);
  assert.strictEqual(actualizada.datos.titulo, 'Original');

  const eliminada = await peticion('DELETE', '/tareas/1');
  assert.strictEqual(eliminada.estado, 204);

  const yaNoExiste = await peticion('GET', '/tareas/1');
  assert.strictEqual(yaNoExiste.estado, 404);
});

test('responde errores claros para ids inválidos, JSON roto y rutas inexistentes', async () => {
  assert.strictEqual((await peticion('GET', '/tareas/abc')).estado, 400);
  assert.strictEqual((await peticion('PUT', '/tareas/99', { titulo: 'X' })).estado, 404);
  assert.strictEqual((await peticion('PUT', '/tareas/1', {})).estado, 400);
  assert.strictEqual((await peticion('GET', '/no-existe')).estado, 404);

  const jsonRoto = await fetch(urlBase + '/tareas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{ titulo: ',
  });
  assert.strictEqual(jsonRoto.status, 400);
});
