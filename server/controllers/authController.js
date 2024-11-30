// server/controllers/authController.js
const db = require('../config/db');

exports.login = (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';

    db.query(query, [username, password], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error en el servidor' });
        } else if (results.length > 0) {
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    });
};
