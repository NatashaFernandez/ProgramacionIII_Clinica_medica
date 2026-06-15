-- Configuración inicial y creación de BD
CREATE DATABASE IF NOT EXISTS `prog3_turnos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `prog3_turnos`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Estructura de tablas (con AUTO_INCREMENT definido en el CREATE)
-- --------------------------------------------------------

DROP TABLE IF EXISTS `especialidades`;
CREATE TABLE `especialidades` (
  `id_especialidad` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_especialidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=15;

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `documento` varchar(20) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `foto_path` varchar(255) NOT NULL,
  `rol` tinyint(3) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=13;

DROP TABLE IF EXISTS `medicos`;
CREATE TABLE `medicos` (
  `id_medico` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_especialidad` int(10) UNSIGNED NOT NULL,
  `matricula` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valor_consulta` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_medico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=5;

DROP TABLE IF EXISTS `obras_sociales`;
CREATE TABLE `obras_sociales` (
  `id_obra_social` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `porcentaje_descuento` decimal(9,2) NOT NULL,
  `es_particular` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_obra_social`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=5;

DROP TABLE IF EXISTS `medicos_obras_sociales`;
CREATE TABLE `medicos_obras_sociales` (
  `id_medico_obra_social` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_medico` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_medico_obra_social`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=5;

DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE `pacientes` (
  `id_paciente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id_paciente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=4;

DROP TABLE IF EXISTS `turnos_reservas`;
CREATE TABLE `turnos_reservas` (
  `id_turno_reserva` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_medico` int(10) UNSIGNED NOT NULL,
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `atentido` tinyint(3) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_turno_reserva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=8;

-- --------------------------------------------------------
-- Índices Adicionales y FKs
-- --------------------------------------------------------

ALTER TABLE `especialidades` ADD UNIQUE KEY `nombre` (`nombre`);
ALTER TABLE `usuarios` ADD UNIQUE KEY `documento` (`documento`), ADD UNIQUE KEY `email` (`email`);
ALTER TABLE `medicos` ADD UNIQUE KEY `matricula` (`matricula`), ADD KEY `fk_medicos_especialidades` (`id_especialidad`), ADD KEY `fk_medicos_usuarios` (`id_usuario`);
ALTER TABLE `obras_sociales` ADD UNIQUE KEY `nombre` (`nombre`);

-- Foreign Keys
ALTER TABLE `medicos` 
  ADD CONSTRAINT `fk_medicos_especialidades` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`),
  ADD CONSTRAINT `fk_medicos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `medicos_obras_sociales` 
  ADD CONSTRAINT `fk_mos_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_mos_obra_social` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`);

ALTER TABLE `pacientes` 
  ADD CONSTRAINT `fk_pacientes_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`),
  ADD CONSTRAINT `fk_pacientes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

ALTER TABLE `turnos_reservas` 
  ADD CONSTRAINT `fk_turnos_reservas_medicos` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`),
  ADD CONSTRAINT `fk_turnos_reservas_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`),
  ADD CONSTRAINT `fk_turnos_reservas_pacientes` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`);

-- --------------------------------------------------------
-- Vistas
-- --------------------------------------------------------

CREATE OR REPLACE VIEW `v_medicos` AS 
SELECT `m`.`id_medico`, `m`.`id_usuario`, `u`.`apellido`, `u`.`nombres`, `u`.`email`, `u`.`foto_path` 
FROM `medicos` `m` 
JOIN `usuarios` `u` ON `m`.`id_usuario` = `u`.`id_usuario` 
WHERE `u`.`activo` = 1;

CREATE OR REPLACE VIEW `v_pacientes` AS 
SELECT `p`.`id_paciente`, `p`.`id_usuario`, `u`.`apellido`, `u`.`nombres`, `u`.`email`, `os`.`id_obra_social`, `os`.`descripcion` AS `descripcion_obra_social`, `u`.`foto_path` 
FROM `pacientes` `p` 
JOIN `usuarios` `u` ON `p`.`id_usuario` = `u`.`id_usuario` 
JOIN `obras_sociales` `os` ON `p`.`id_obra_social` = `os`.`id_obra_social` 
WHERE `u`.`activo` = 1;

COMMIT;