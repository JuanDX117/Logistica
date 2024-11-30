const express = require('express');
const router = express.Router();
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Sin contraseña en XAMPP
    database: 'AppLogistica',
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Crear la aplicación Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---- RUTAS DE EMPLEADOS ----

// Obtener todos los empleados
app.get('/api/empleados', (req, res) => {
    const query = 'SELECT * FROM empleados';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener empleados:', err);
            return res.status(500).send('Error al obtener empleados');
        }
        res.json(result);
    });
});

// Agregar un nuevo empleado
app.post('/api/empleados', (req, res) => {
    const { nombre, cedula } = req.body;
    const query = 'INSERT INTO empleados (nombre, cedula) VALUES (?, ?)';
    db.query(query, [nombre, cedula], (err, result) => {
        if (err) {
            console.error('Error al agregar empleado:', err);
            return res.status(500).send('Error al agregar empleado');
        }
        res.json({ message: 'Empleado agregado exitosamente', id: result.insertId });
    });
});

// Eliminar un empleado
app.delete('/api/empleados/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM empleados WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar empleado:', err);
            return res.status(500).send('Error al eliminar empleado');
        }
        res.json({ message: 'Empleado eliminado exitosamente' });
    });
});

// Actualizar un empleado
app.put('/api/empleados/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, cedula } = req.body;
    const query = 'UPDATE empleados SET nombre = ?, cedula = ? WHERE id = ?';
    db.query(query, [nombre, cedula, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar empleado:', err);
            return res.status(500).send('Error al actualizar empleado');
        }
        res.json({ message: 'Empleado actualizado exitosamente' });
    });
});

// ---- RUTAS DE EVENTOS ----

// Crear un evento
app.post('/api/eventos', (req, res) => {
    const { evento_nombre, fecha } = req.body;

    const query = 'INSERT INTO eventos (evento_nombre, fecha) VALUES (?, ?)';
    db.query(query, [evento_nombre, fecha], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ eventoId: result.insertId });
    });
});

// Obtener todos los eventos
app.get('/api/eventos', (req, res) => {
    const query = 'SELECT * FROM eventos';
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Eliminar un evento
app.delete('/api/eventos/:id', (req, res) => {
    const { id } = req.params;

    const deleteAssignmentsQuery = 'DELETE FROM eventos_asignaciones WHERE evento_id = ?';
    db.query(deleteAssignmentsQuery, [id], (err) => {
        if (err) {
            console.error('Error al eliminar asignaciones de evento:', err);
            return res.status(500).send('Error al eliminar asignaciones de evento');
        }

        const deleteEventQuery = 'DELETE FROM eventos WHERE id = ?';
        db.query(deleteEventQuery, [id], (err, result) => {
            if (err) {
                console.error('Error al eliminar evento:', err);
                return res.status(500).send('Error al eliminar evento');
            }
            res.json({ message: 'Evento eliminado exitosamente' });
        });
    });
});

// Actualizar un evento
app.put('/api/eventos/:id', (req, res) => {
    const { id } = req.params;
    const { evento_nombre, fecha } = req.body;

    const query = 'UPDATE eventos SET evento_nombre = ?, fecha = ? WHERE id = ?';
    db.query(query, [evento_nombre, fecha, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar evento:', err);
            return res.status(500).send('Error al actualizar evento');
        }
        res.json({ message: 'Evento actualizado exitosamente' });
    });
});

// Asignar empleados a un evento
app.post('/api/eventos/:eventoId/asignar', (req, res) => {
    const eventoId = req.params.eventoId;
    const { empleado_id, cargo_id } = req.body;

    const query = 'INSERT INTO eventos_asignaciones (evento_id, empleado_id, cargo_id) VALUES (?, ?, ?)';
    db.query(query, [eventoId, empleado_id, cargo_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const asignacionQuery = `
            SELECT e.nombre AS empleadoNombre, e.cedula AS empleadoCedula, 
                   c.nombre AS cargoNombre, c.valor AS valor
            FROM eventos_asignaciones ea
            JOIN empleados e ON ea.empleado_id = e.id
            JOIN cargos c ON ea.cargo_id = c.id
            WHERE ea.id = ?`;

        db.query(asignacionQuery, [result.insertId], (err, data) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({
                message: 'Asignación exitosa',
                asignacion: data[0],
            });
        });
    });
});

// Eliminar una asignación de empleado de un evento
app.delete('/api/eventos/:eventoId/asignaciones/:asignacionId', (req, res) => {
    const { eventoId, asignacionId } = req.params;

    const query = 'DELETE FROM eventos_asignaciones WHERE evento_id = ? AND id = ?';
    db.query(query, [eventoId, asignacionId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: 'Asignación eliminada exitosamente' });
    });
});

// Obtener todos los cargos
app.get('/api/cargos', (req, res) => {
    const query = 'SELECT * FROM cargos';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los cargos:', err);
            res.status(500).send('Error al obtener los cargos.');
        } else {
            res.json(results);
        }
    });
});

// Obtener asignaciones de un evento
app.get('/api/eventos/:eventoId/asignaciones', (req, res) => {
    const eventoId = req.params.eventoId;

    const query = `
        SELECT ea.id, e.nombre AS empleadoNombre, c.nombre AS cargoNombre
        FROM eventos_asignaciones ea
        JOIN empleados e ON ea.empleado_id = e.id
        JOIN cargos c ON ea.cargo_id = c.id
        WHERE ea.evento_id = ?`;

    db.query(query, [eventoId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(result);
    });
});

// Ruta para obtener la nómina
app.get('/api/nomina', (req, res) => {
    const query = `
        SELECT e.nombre, e.cedula, SUM(c.valor) AS totalPagar
        FROM eventos_asignaciones ea
        JOIN empleados e ON ea.empleado_id = e.id
        JOIN cargos c ON ea.cargo_id = c.id
        GROUP BY e.cedula`;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(result);
    });
});

// Ruta para pagar a un empleado
app.post('/api/nomina/pagar', (req, res) => {
    const { cedula } = req.body;

    const deleteQuery = 'DELETE FROM eventos_asignaciones WHERE empleado_id IN (SELECT id FROM empleados WHERE cedula = ?)';
    db.query(deleteQuery, [cedula], (err, result) => {
        if (err) {
            console.error('Error al procesar el pago:', err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: `Pago realizado a ${cedula}` });
    });
});

// En el backend (Express.js o lo que estés usando)
app.post('/api/nomina/pagarTodos', async (req, res) => {
    try {
      // Lógica para pagar a todos los empleados, por ejemplo:
      await NominaModel.updateMany({}, { $set: { pagado: true } }); // Cambiar el estado de todos los empleados
      res.status(200).send('Todos los empleados han sido pagados');
    } catch (error) {
      console.error('Error al pagar todos los empleados:', error);
      res.status(500).send('Error al pagar a todos los empleados');
    }
  });  

// INICIAR EL SERVIDOR
const port = 5000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
