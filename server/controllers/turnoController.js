// server/controllers/turnoController.js
const db = require('../config/db');

// Controlador para asignar turnos
const assignTurno = (req, res) => {
    const { evento_id, empleado_id, turnos, pago } = req.body;
    const query = 'INSERT INTO turnos (evento_id, empleado_id, turnos, pago) VALUES (?, ?, ?, ?)';
    
    db.query(query, [evento_id, empleado_id, turnos, pago], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al asignar el turno' });
        }
        res.status(201).json({ message: 'Turno asignado exitosamente' });
    });
};

// Controlador para obtener turnos de un evento
const getTurnosPorEvento = (req, res) => {
    const { evento_id } = req.params;
    const query = 'SELECT * FROM turnos WHERE evento_id = ?';
    
    db.query(query, [evento_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener turnos' });
        }
        res.status(200).json(results);
    });
};

module.exports = { assignTurno, getTurnosPorEvento };
