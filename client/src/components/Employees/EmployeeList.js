import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirigir al Home
import './EmployeeList.css'; // Importa el CSS actualizado

const EmployeeList = () => {
    const [empleados, setEmpleados] = useState([]);
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [editando, setEditando] = useState(null);
    const navigate = useNavigate(); // Hook para navegación

    useEffect(() => {
        obtenerEmpleados();
    }, []);

    const obtenerEmpleados = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/empleados');
            setEmpleados(response.data);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
        }
    };

    const agregarEmpleado = async () => {
        if (!nombre || !cedula) {
            alert('Por favor completa todos los campos.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/empleados', { nombre, cedula });
            alert('Empleado agregado exitosamente');
            setNombre('');
            setCedula('');
            obtenerEmpleados();
        } catch (error) {
            console.error('Error al agregar empleado:', error);
        }
    };

    const eliminarEmpleado = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/empleados/${id}`);
            alert('Empleado eliminado exitosamente');
            obtenerEmpleados();
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
        }
    };

    const editarEmpleado = (empleado) => {
        setEditando(empleado.id);
        setNombre(empleado.nombre);
        setCedula(empleado.cedula);
    };

    const actualizarEmpleado = async () => {
        if (!nombre || !cedula) {
            alert('Por favor completa todos los campos.');
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/empleados/${editando}`, { nombre, cedula });
            alert('Empleado actualizado exitosamente');
            setNombre('');
            setCedula('');
            setEditando(null);
            obtenerEmpleados();
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
        }
    };

    return (
        <div className="employee-list-container">
            <h2>Lista de Empleados</h2>

            <div className="employee-form">
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        placeholder="Ingresa el nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Cédula</label>
                    <input
                        type="text"
                        placeholder="Ingresa la cédula"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                    />
                </div>
                {editando ? (
                    <button className="add-button" onClick={actualizarEmpleado}>
                        Actualizar Empleado
                    </button>
                ) : (
                    <button className="add-button" onClick={agregarEmpleado}>
                        Agregar Empleado
                    </button>
                )}
            </div>

            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cédula</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empleados.map((empleado) => (
                        <tr key={empleado.id}>
                            <td>{empleado.nombre}</td>
                            <td>{empleado.cedula}</td>
                            <td>
                                <button
                                    className="edit-button"
                                    onClick={() => editarEmpleado(empleado)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => eliminarEmpleado(empleado.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                className="home-button"
                onClick={() => navigate('../Home')} // Redirige al Home
            >
                Ir al Home
            </button>
        </div>
    );
};

export default EmployeeList;
