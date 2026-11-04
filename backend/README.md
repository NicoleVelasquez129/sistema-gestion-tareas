# Backend – Sistema de Gestión de Tareas

API REST hecha con **Node.js + Express**.

## Cómo ejecutarlo

Requisitos: Node.js 20 o superior.

```bash
cd backend
npm install      # instala dependencias (solo la primera vez)
npm run dev      # inicia el servidor y lo reinicia al guardar cambios
npm test         # ejecuta las pruebas automáticas
```

El servidor queda en `http://localhost:3000`.

> **Nota:** por ahora las tareas se guardan **en memoria** (se pierden al reiniciar).
> Cuando el equipo de base de datos defina el motor, solo se reemplaza
> `src/repositories/tareasRepositorio.js`.

## Estructura

```
backend/
├── src/
│   ├── server.js            # Punto de entrada
│   ├── app.js               # Configuración de Express
│   ├── config/              # Puerto, CORS, etc.
│   ├── routes/              # URL → controlador
│   ├── controllers/         # Recibe la petición y responde
│   ├── services/            # Lógica de negocio y validaciones
│   ├── repositories/        # Acceso a datos (memoria / base de datos)
│   ├── middlewares/         # Manejo de errores
│   └── utils/               # Validaciones y errores personalizados
└── test/                    # Pruebas automáticas
```

---

## Contrato de la API (para frontend y base de datos)

URL base: `http://localhost:3000/api`

### Modelo `Tarea`

Los nombres de los campos coinciden con los que ya usa el frontend (`index.html`).

| Campo          | Tipo     | Obligatorio | Valores / notas                                  | Por defecto  |
|----------------|----------|-------------|--------------------------------------------------|--------------|
| `id`           | número   | automático  | Entero autoincremental                           | —            |
| `titulo`       | texto    | sí          | Máx. 100 caracteres                              | —            |
| `descripcion`  | texto    | no          | Máx. 1000 caracteres                             | `""`         |
| `prioridad`    | texto    | no          | `baja`, `media`, `alta`                          | `media`      |
| `fecha`        | texto    | no          | Fecha límite `AAAA-MM-DD`; `""` o `null` = sin fecha | `null`   |
| `completada`   | booleano | no          | `true` o `false`                                 | `false`      |
| `creadoEn`     | texto    | automático  | Fecha ISO 8601                                   | —            |
| `actualizadoEn`| texto    | automático  | Fecha ISO 8601                                   | —            |

### Endpoints

| Método | Ruta                | Descripción                         | Respuesta exitosa      |
|--------|---------------------|-------------------------------------|------------------------|
| GET    | `/api/salud`        | Verifica que el servidor funciona   | `200`                  |
| GET    | `/api/tareas`       | Lista tareas                        | `200` + arreglo        |
| GET    | `/api/tareas/:id`   | Obtiene una tarea                   | `200` + tarea          |
| POST   | `/api/tareas`       | Crea una tarea                      | `201` + tarea creada   |
| PUT    | `/api/tareas/:id`   | Actualiza **solo los campos enviados** | `200` + tarea       |
| DELETE | `/api/tareas/:id`   | Elimina una tarea                   | `204` (sin contenido)  |

**Filtros opcionales** en `GET /api/tareas`: `?completada=false` y/o `?prioridad=alta`.

### Ejemplos

Crear una tarea:

```http
POST /api/tareas
Content-Type: application/json

{
  "titulo": "Terminar informe",
  "descripcion": "Sección de conclusiones",
  "prioridad": "alta",
  "fecha": "2026-11-20"
}
```

Respuesta `201`:

```json
{
  "id": 1,
  "titulo": "Terminar informe",
  "descripcion": "Sección de conclusiones",
  "prioridad": "alta",
  "fecha": "2026-11-20",
  "completada": false,
  "creadoEn": "2026-11-04T15:00:00.000Z",
  "actualizadoEn": "2026-11-04T15:00:00.000Z"
}
```

Marcar como completada:

```http
PUT /api/tareas/1
Content-Type: application/json

{ "completada": true }
```

### Errores

Todas las respuestas de error tienen el mismo formato:

```json
{
  "error": "Datos inválidos",
  "detalles": ["El campo \"titulo\" es obligatorio"]
}
```

| Código | Significado                                          |
|--------|------------------------------------------------------|
| `400`  | Datos inválidos, id no numérico o JSON mal formado   |
| `404`  | La tarea o la ruta no existe                         |
| `500`  | Error interno del servidor                           |
