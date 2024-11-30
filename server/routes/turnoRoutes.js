// server/routes/turnoRoutes.js
const express = require('express');
const { assignTurno, getTurnosPorEvento } = require('../controllers/turnoController');
const router = express.Router();

// Ruta para asignar turno
router.post('/', assignTurno);

// Ruta para obtener turnos de un evento
router.get('/:evento_id', getTurnosPorEvento);

module.exports = router;
