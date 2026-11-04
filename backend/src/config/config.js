// Configuración general de la aplicación.
// Los valores se pueden sobrescribir con variables de entorno (ver .env.example).

const config = {
  // Puerto donde escucha el servidor
  puerto: Number(process.env.PUERTO) || 3000,

  // Origen permitido para CORS (la URL del frontend). '*' permite cualquiera.
  origenCors: process.env.ORIGEN_CORS || '*',
};

module.exports = config;
