-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS AppLogistica;

-- Seleccionar la base de datos recién creada
USE AppLogistica;

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Crear la tabla de eventos (solo con nombre y fecha)
CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_nombre VARCHAR(255) NOT NULL,  -- Nombre del evento
    fecha DATE NOT NULL                  -- Fecha del evento
);

-- Crear la tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE
);

-- Crear la tabla de cargos predefinidos
CREATE TABLE IF NOT EXISTS cargos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL
);

-- Nueva tabla para asignaciones de empleados a eventos con cargos
CREATE TABLE IF NOT EXISTS eventos_asignaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,             -- Relación con el evento
    empleado_id INT NOT NULL,           -- Relación con el empleado
    cargo_id INT NOT NULL,              -- Relación con el cargo
    FOREIGN KEY (evento_id) REFERENCES eventos(id),  -- Relación con la tabla eventos
    FOREIGN KEY (empleado_id) REFERENCES empleados(id), -- Relación con la tabla empleados
    FOREIGN KEY (cargo_id) REFERENCES cargos(id)       -- Relación con la tabla cargos
);

-- Insertar un usuario admin con contraseña encriptada (bcrypt)
INSERT INTO usuarios (username, password) 
VALUES ('admin', '$2y$10$DwJPOqWrm8GfyTczM6Uie.WvHbQ3c6J65bBP/TV90EQOQWIm4YmPu');

-- Insertar cargos predefinidos
INSERT INTO cargos (nombre, valor) 
VALUES 
('Mesero', 30000),
('Guardia', 25000),
('Logística', 20000);
