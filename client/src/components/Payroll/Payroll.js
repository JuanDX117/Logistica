import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/Payroll.css";

function Payroll() {
  const [nominados, setNominados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    obtenerNominados();
  }, []);

  const obtenerNominados = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/nomina");
      setNominados(res.data);
    } catch (err) {
      console.error("Error al obtener nómina:", err);
    }
  };

  const pagarEmpleado = async (empleadoId) => {
    try {
      await axios.post(`http://localhost:3001/api/nomina/pagar/${empleadoId}`);
      obtenerNominados();
    } catch (err) {
      console.error("Error al pagar empleado:", err);
    }
  };

  const pagarSeleccionados = async () => {
    try {
      await axios.post("http://localhost:3001/api/nomina/pagar", {
        empleados: seleccionados,
      });
      setSeleccionados([]);
      obtenerNominados();
    } catch (err) {
      console.error("Error al pagar empleados seleccionados:", err);
    }
  };

  const toggleSeleccionar = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id)
        ? prev.filter((empleadoId) => empleadoId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="payroll">
      <h2>Nómina de Empleados</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Eventos Participados</th>
            <th>Total a Pagar</th>
            <th>Seleccionar</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {nominados.map((empleado) => (
            <tr key={empleado.id}>
              <td>{empleado.nombre}</td>
              <td>{empleado.cedula}</td>
              <td>{empleado.eventos_participados}</td>
              <td>${empleado.total_a_pagar}</td>
              <td>
                <input
                  type="checkbox"
                  checked={seleccionados.includes(empleado.id)}
                  onChange={() => toggleSeleccionar(empleado.id)}
                />
              </td>
              <td>
                <button onClick={() => pagarEmpleado(empleado.id)}>Pagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={pagarSeleccionados}>Pagar Seleccionados</button>
    </div>
  );
}

export default Payroll;
