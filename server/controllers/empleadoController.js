const db = require('../config/db');

// Obtener todos los empleados
exports.getEmpleados = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM empleados');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Agregar un empleado
exports.addEmpleado = async (req, res) => {
  const { name, id } = req.body;
  try {
    await db.query('INSERT INTO empleados (name, cedula) VALUES (?, ?)', [
      name,
      id,
    ]);
    res.status(201).json({ message: 'Empleado agregado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar un empleado
exports.updateEmpleado = async (req, res) => {
  const { id } = req.params;
  const { name, cedula } = req.body;
  try {
    await db.query(
      'UPDATE empleados SET name = ?, cedula = ? WHERE id = ?',
      [name, cedula, id]
    );
    res.status(200).json({ message: 'Empleado actualizado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un empleado
exports.deleteEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM empleados WHERE id = ?', [id]);
    res.status(200).json({ message: 'Empleado eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
