// server/routes/eventoRoutes.js
const express = require('express');
const { addEvento, getEventos } = require('../controllers/eventoController');
const router = express.Router();

// Ruta para agregar evento
router.post('/', addEvento);

// Ruta para obtener todos los eventos
router.get('/', getEventos);

module.exports = router;
