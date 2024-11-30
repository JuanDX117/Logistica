// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Simulación de usuarios en "base de datos"
const users = [
  { username: 'admin', password: '1234' }, // Credenciales para el login
];

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
  }
});

module.exports = router;
