import React, { useState, useEffect } from 'react';
import './AsignarTurnos.css';

const AsignarTurnos = () => {
    const [empleados, setEmpleados] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [asignados, setAsignados] = useState([]);
    const [selectedEmpleado, setSelectedEmpleado] = useState('');
    const [selectedCargo, setSelectedCargo] = useState('');

    // Cargar empleados desde la base de datos
    useEffect(() => {
        fetch('http://localhost:5000/api/empleados')
            .then((res) => res.json())
            .then(setEmpleados)
            .catch(() => alert('Error al cargar la lista de empleados.'));
    }, []);

    // Cargar cargos desde la base de datos
    useEffect(() => {
        fetch('http://localhost:5000/api/cargos')
            .then((res) => res.json())
            .then(setCargos)
            .catch(() => alert('Error al cargar la lista de cargos.'));
    }, []);

    // Cargar asignaciones previas desde localStorage
    useEffect(() => {
        const asignacionesGuardadas = JSON.parse(localStorage.getItem('asignaciones')) || [];
        setAsignados(asignacionesGuardadas);
    }, []);

    // Asignar empleado y cargo a la tabla (solo visual)
    const asignarEmpleado = () => {
        if (!selectedEmpleado || !selectedCargo) {
            alert('Por favor selecciona un empleado y un cargo.');
            return;
        }

        const empleadoSeleccionado = empleados.find((e) => e.id === parseInt(selectedEmpleado));
        const cargoSeleccionado = cargos.find((c) => c.id === parseInt(selectedCargo));

        const nuevaAsignacion = {
            id: `${selectedEmpleado}-${selectedCargo}`,
            empleadoNombre: empleadoSeleccionado.nombre,
            empleadoCedula: empleadoSeleccionado.cedula,
            cargoNombre: cargoSeleccionado.nombre,
            cargoValor: cargoSeleccionado.valor,
        };

        setAsignados((prev) => {
            const nuevasAsignaciones = [...prev, nuevaAsignacion];
            // Guardar las asignaciones en localStorage
            localStorage.setItem('asignaciones', JSON.stringify(nuevasAsignaciones));
            return nuevasAsignaciones;
        });

        setSelectedEmpleado('');
        setSelectedCargo('');
    };

    // Guardar asignaciones en la base de datos
    const guardarAsignaciones = () => {
        if (asignados.length === 0) {
            alert('No hay asignaciones para guardar.');
            return;
        }

        // Transformar los datos a un formato aceptado por la API
        const dataToSave = asignados.map((asignacion) => ({
            empleado_id: empleados.find((e) => e.nombre === asignacion.empleadoNombre).id,
            cargo_id: cargos.find((c) => c.nombre === asignacion.cargoNombre).id,
        }));

        fetch('http://localhost:5000/api/eventos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
        })
            .then((res) => {
                if (res.ok) {
                    alert('Asignaciones guardadas exitosamente.');
                } else {
                    throw new Error('Error al guardar asignaciones.');
                }
            })
            .catch(() => alert('Error al guardar las asignaciones.'));
    };

    return (
        <div className="asignar-turnos-container">
            <h1>Asignar Turnos</h1>

            <div className="form-group">
                <label>Seleccionar Empleado:</label>
                <select
                    value={selectedEmpleado}
                    onChange={(e) => setSelectedEmpleado(e.target.value)}
                >
                    <option value="">-- Seleccionar Empleado --</option>
                    {empleados.map((empleado) => (
                        <option key={empleado.id} value={empleado.id}>
                            {empleado.nombre} - {empleado.cedula}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Seleccionar Cargo:</label>
                <select
                    value={selectedCargo}
                    onChange={(e) => setSelectedCargo(e.target.value)}
                >
                    <option value="">-- Seleccionar Cargo --</option>
                    {cargos.map((cargo) => (
                        <option key={cargo.id} value={cargo.id}>
                            {cargo.nombre} (${cargo.valor})
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={asignarEmpleado}>Asignar</button>
            <button onClick={guardarAsignaciones}>Guardar en Base de Datos</button>

            <h2>Asignaciones</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cédula</th>
                        <th>Cargo</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {asignados.map((asignacion) => (
                        <tr key={asignacion.id}>
                            <td>{asignacion.empleadoNombre}</td>
                            <td>{asignacion.empleadoCedula}</td>
                            <td>{asignacion.cargoNombre}</td>
                            <td>${asignacion.cargoValor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AsignarTurnos;
