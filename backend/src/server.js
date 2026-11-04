// Punto de entrada: levanta el servidor HTTP.

const app = require('./app');
const config = require('./config/config');

app.listen(config.puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${config.puerto}`);
});
