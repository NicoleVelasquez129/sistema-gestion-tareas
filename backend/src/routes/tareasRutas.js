// Rutas de tareas: conecta cada URL y método HTTP con su función del controlador.

const { Router } = require('express');
const controlador = require('../controllers/tareasControlador');

const router = Router();

router.get('/', controlador.listar);
router.get('/:id', controlador.obtener);
router.post('/', controlador.crear);
router.put('/:id', controlador.actualizar);
router.delete('/:id', controlador.eliminar);

module.exports = router;
