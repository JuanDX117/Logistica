const mysql = require('mysql');

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',      // Dirección del servidor MySQL
    user: 'root',           // Usuario predeterminado de XAMPP
    password: '',           // Sin contraseña
    database: 'AppLogistica' // Nombre de la base de datos
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        return;
    }
    console.log('Conexión exitosa a la base de datos AppLogistica');
});

module.exports = db;
