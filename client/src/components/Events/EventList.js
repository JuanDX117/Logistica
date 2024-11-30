import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EventList.css";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [newEvent, setNewEvent] = useState({ nombre: "", fecha: "" });
  const [editingEventId, setEditingEventId] = useState(null);
  const [editedEvent, setEditedEvent] = useState({ nombre: "", fecha: "" });
  const [collapseStates, setCollapseStates] = useState({});
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState("");
  const [selectedCargoId, setSelectedCargoId] = useState("");
  const [selectedEmpleadoCedula, setSelectedEmpleadoCedula] = useState(""); // Para mostrar la cédula del empleado
  const navigate = useNavigate();

  // Cargar datos desde la base de datos al iniciar
  useEffect(() => {
    fetch("http://localhost:5000/api/eventos")
      .then((res) => res.json())
      .then((data) => {
        const formattedEvents = data.map((event) => ({
          ...event,
          asignaciones: [], // Inicializar asignaciones vacías
        }));
        setEvents(formattedEvents);
      })
      .catch(() => alert("Error al cargar los eventos."));

    fetch("http://localhost:5000/api/empleados")
      .then((res) => res.json())
      .then(setEmpleados)
      .catch(() => alert("Error al cargar empleados."));

    fetch("http://localhost:5000/api/cargos")
      .then((res) => res.json())
      .then(setCargos)
      .catch(() => alert("Error al cargar cargos."));
  }, []);

  // Obtener asignaciones de un evento
  const loadAssignments = (eventId) => {
    fetch(`http://localhost:5000/api/eventos/${eventId}/asignaciones`)
      .then((res) => res.json())
      .then((data) => {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId
              ? { ...event, asignaciones: data }
              : event
          )
        );
      })
      .catch(() => alert("Error al cargar las asignaciones."));
  };

  const toggleCollapse = (id) => {
    setCollapseStates((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!collapseStates[id]) {
      loadAssignments(id); // Cargar asignaciones cuando se abre el evento
    }
  };

  const addEvent = () => {
    if (!newEvent.nombre || !newEvent.fecha) {
      alert("Por favor, completa todos los campos del evento.");
      return;
    }

    const event = {
      evento_nombre: newEvent.nombre,
      fecha: newEvent.fecha,
    };

    fetch("http://localhost:5000/api/eventos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents((prev) => [
          ...prev,
          {
            id: data.eventoId,
            evento_nombre: newEvent.nombre,
            fecha: newEvent.fecha,
            asignaciones: [],
          },
        ]);
        setNewEvent({ nombre: "", fecha: "" });
      })
      .catch(() => alert("Error al agregar el evento."));
  };

  const deleteEvent = (id) => {
    fetch(`http://localhost:5000/api/eventos/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setEvents((prev) => prev.filter((event) => event.id !== id));
        const updatedCollapseStates = { ...collapseStates };
        delete updatedCollapseStates[id];
        setCollapseStates(updatedCollapseStates);
      })
      .catch(() => alert("Error al eliminar el evento."));
  };

  const editEvent = (id) => {
    const event = events.find((event) => event.id === id);
    setEditingEventId(id);
    setEditedEvent({
      nombre: event.evento_nombre,
      fecha: event.fecha.split("T")[0], // Formatear la fecha al formato YYYY-MM-DD
    });
  };

  const saveEvent = () => {
    const updatedEvent = {
      evento_nombre: editedEvent.nombre,
      fecha: editedEvent.fecha,
    };

    fetch(`http://localhost:5000/api/eventos/${editingEventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    })
      .then(() => {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === editingEventId
              ? { ...event, ...updatedEvent }
              : event
          )
        );
        setEditingEventId(null);
        setEditedEvent({ nombre: "", fecha: "" });
      })
      .catch(() => alert("Error al actualizar el evento."));
  };

  const assignEmployee = (eventId) => {
    if (!selectedEmpleadoId || !selectedCargoId) {
      alert("Por favor, selecciona un empleado y un cargo.");
      return;
    }

    const empleado = empleados.find(
      (empleado) => empleado.id === parseInt(selectedEmpleadoId)
    );
    const cargo = cargos.find((cargo) => cargo.id === parseInt(selectedCargoId));

    // Verificar si el empleado ya está asignado al evento
    const existingAssignment = events
      .find((event) => event.id === eventId)
      .asignaciones.some((asignacion) => asignacion.empleadoId === selectedEmpleadoId);

    if (existingAssignment) {
      alert("Este empleado ya está asignado a este evento.");
      return;
    }

    const nuevaAsignacion = {
      empleado_id: selectedEmpleadoId,
      cargo_id: selectedCargoId,
    };

    fetch(`http://localhost:5000/api/eventos/${eventId}/asignar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaAsignacion),
    })
      .then(() => {
        loadAssignments(eventId); // Recargar asignaciones después de asignar
        setSelectedEmpleadoId(""); // Limpiar el campo de empleado
        setSelectedCargoId(""); // Limpiar el campo de cargo
        setSelectedEmpleadoCedula(""); // Limpiar cédula
      })
      .catch(() => alert("Error al asignar el empleado."));
  };

  const deleteAssignment = (eventId, asignacionId) => {
    fetch(
      `http://localhost:5000/api/eventos/${eventId}/asignaciones/${asignacionId}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  asignaciones: event.asignaciones.filter(
                    (asignacion) => asignacion.id !== asignacionId
                  ),
                }
              : event
          )
        );
      })
      .catch(() => alert("Error al eliminar la asignación."));
  };

  return (
    <div className="event-list-container">
      <div className="header">
        <h1>Gestión de Eventos</h1>
        <button className="home-button" onClick={() => navigate("../Home")}>
          Ir al Home
        </button>
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Nombre del evento"
          value={newEvent.nombre}
          onChange={(e) => setNewEvent({ ...newEvent, nombre: e.target.value })}
        />
        <input
          type="date"
          value={newEvent.fecha}
          onChange={(e) => setNewEvent({ ...newEvent, fecha: e.target.value })}
        />
        <button onClick={addEvent}>Agregar Evento</button>
      </div>

      {events.map((event) => (
        <div key={event.id} className="event-item">
          {editingEventId === event.id ? (
            <>
              <input
                type="text"
                value={editedEvent.nombre}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, nombre: e.target.value })
                }
              />
              <input
                type="date"
                value={editedEvent.fecha}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, fecha: e.target.value })
                }
              />
              <button onClick={saveEvent}>Guardar</button>
              <button onClick={() => setEditingEventId(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <h2>{event.evento_nombre}</h2>
              <p>{event.fecha.split("T")[0]}</p>
              <button onClick={() => deleteEvent(event.id)}>Eliminar</button>
              <button onClick={() => editEvent(event.id)}>Editar</button>
              <button onClick={() => toggleCollapse(event.id)}>
                {collapseStates[event.id]
                  ? "Ocultar Asignaciones"
                  : "Mostrar Asignaciones"}
              </button>
              {collapseStates[event.id] && (
                <div className="assignments">
                  {event.asignaciones.length === 0 ? (
                    <p>No hay asignaciones</p>
                  ) : (
                    <table>
                        <thead>       
                            <th>Nombre</th>
                            <th>Cargo</th>
                            <th>Acciones</th>
                        </thead>
                        <tbody>
                            {event.asignaciones.map((asignacion) => (
                            <tr key={asignacion.id}>
                                <td>{asignacion.empleadoNombre}</td>
                                <td>{asignacion.cargoNombre}</td>
                                <td>
                                <button
                                    onClick={() =>
                                    deleteAssignment(event.id, asignacion.id)
                                    }
                                >
                                    Eliminar
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                  )}

                <select
                    value={selectedEmpleadoId}
                    onChange={(e) => {
                        const empleado = empleados.find(
                        (emp) => emp.id === parseInt(e.target.value)
                        );
                        setSelectedEmpleadoId(e.target.value);
                        setSelectedEmpleadoCedula(empleado ? empleado.cedula : "");
                    }}
                    >
                    <option value="">Seleccionar Empleado</option>
                    {empleados.map((empleado) => (
                        <option key={empleado.id} value={empleado.id}>
                        {empleado.nombre} - {empleado.cedula}
                        </option>
                    ))}
                    </select>

                    <select
                    value={selectedCargoId}
                    onChange={(e) => {
                        const cargo = cargos.find(
                        (car) => car.id === parseInt(e.target.value)
                        );
                        setSelectedCargoId(e.target.value);
                    }}
                    >
                    <option value="">Seleccionar Cargo</option>
                    {cargos.map((cargo) => (
                        <option key={cargo.id} value={cargo.id}>
                        {cargo.nombre} - ${cargo.valor}
                        </option>
                    ))}
                </select>
                  <button onClick={() => assignEmployee(event.id)}>Asignar</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;
