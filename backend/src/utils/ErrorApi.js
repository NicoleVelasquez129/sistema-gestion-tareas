// Error personalizado que incluye el código de estado HTTP.
// Se lanza desde los servicios y lo atrapa el middleware de errores.

class ErrorApi extends Error {
  /**
   * @param {number} estado - Código HTTP (400, 404, etc.)
   * @param {string} mensaje - Mensaje legible para el cliente
   * @param {Array<string>} [detalles] - Lista opcional de errores específicos
   */
  constructor(estado, mensaje, detalles = []) {
    super(mensaje);
    this.estado = estado;
    this.detalles = detalles;
  }

  static solicitudIncorrecta(mensaje, detalles) {
    return new ErrorApi(400, mensaje, detalles);
  }

  static noEncontrado(mensaje) {
    return new ErrorApi(404, mensaje);
  }
}

module.exports = ErrorApi;
