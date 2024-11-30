// server/controllers/eventoController.js
const db = require('../config/db');

// Controlador para agregar un evento
const addEvento = (req, res) => {
    const { lugar, fecha } = req.body;
    const query = 'INSERT INTO eventos (lugar, fecha) VALUES (?, ?)';
    
    db.query(query, [lugar, fecha], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al agregar el evento' });
        }
        res.status(201).json({ message: 'Evento agregado exitosamente' });
    });
};

// Controlador para obtener todos los eventos
const getEventos = (req, res) => {
    const query = 'SELECT * FROM eventos';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener eventos' });
        }
        res.status(200).json(results);
    });
};

module.exports = { addEvento, getEventos };
