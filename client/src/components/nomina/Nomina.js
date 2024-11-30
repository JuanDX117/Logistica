// client/src/components/nomina/Nomina.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Nomina.css'; // Asegúrate de tener estilos para Nomina.

const Nomina = () => {
  const [empleados, setEmpleados] = useState([]);

  // Función para obtener los empleados con los valores a pagar
  const obtenerNomina = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/nomina'); // Llamada al backend para obtener la nómina
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  // Función para pagar a un empleado y eliminar sus registros
  const pagarEmpleado = async (idEmpleado) => {
    try {
      await axios.post('http://localhost:5000/api/nomina/pagar', { cedula: idEmpleado }); // Llamada al backend para pagar y eliminar registros
      obtenerNomina(); // Volver a obtener la lista después de eliminar
    } catch (error) {
      console.error('Error al pagar al empleado:', error);
    }
  };

  useEffect(() => {
    obtenerNomina(); // Obtener la nómina cuando el componente se monte
  }, []);

  return (
    <div className="nomina-container">
      <h1>Nómina de Empleados</h1>
      <table className="nomina-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Valor a Pagar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.cedula}>
              <td>{empleado.nombre}</td>
              <td>{empleado.cedula}</td>
              <td>{empleado.totalPagar}</td>
              <td>
                <button className="pagar-button" onClick={() => pagarEmpleado(empleado.cedula)}>
                  Pagar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Nomina;
