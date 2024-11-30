import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import EmployeeList from "./components/Employees/EmployeeList";
import EventList from "./components/Events/EventList";
import AsignarTurnos from "./components/Events/AsignarTurnos";
import Nomina from "./components/nomina/Nomina"; // Importar el componente de nómina.

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/asignar-turnos/:eventId" element={<AsignarTurnos />} />
        <Route path="/nomina" element={<Nomina />} /> {/* Nueva ruta para nómina */}
      </Routes>
    </Router>
  );
};

export default App;
