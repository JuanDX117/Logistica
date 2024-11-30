import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Asegúrate de tener estilos para tu Home.

const Home = () => {
    const navigate = useNavigate();

    const goToEmployees = () => {
        navigate('/employees');
    };

    const goToEvents = () => {
        navigate('/events');
    };

    const goToNomina = () => {
        navigate('/nomina');
    };

    return (
        <div className="home-container">
            <h1>Bienvenido a la App de Logística</h1>
            <div className="button-group">
                <button className="home-button" onClick={goToEmployees}>
                    Gestión de Empleados
                </button>
                <button className="home-button" onClick={goToEvents}>
                    Gestión de Eventos
                </button>
                <button className="home-button" onClick={goToNomina}>
                    Gestión de Nómina
                </button>
            </div>
        </div>
    );
};

export default Home;
