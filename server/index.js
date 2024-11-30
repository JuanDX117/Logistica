// server/index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // Usuario de MySQL
    password: '',           // Contraseña de MySQL
    database: 'AppLogistica'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos de MySQL.');
    }
});

// Punto de entrada del servidor
app.listen(3001, () => {
    console.log('Servidor corriendo en el puerto 3001');
});
