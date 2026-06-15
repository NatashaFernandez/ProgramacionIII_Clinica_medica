USE `prog3_turnos`;

-- Desactivar chequeo de llaves foráneas para limpiar sin errores de orden
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `turnos_reservas`;
TRUNCATE TABLE `pacientes`;
TRUNCATE TABLE `medicos_obras_sociales`;
TRUNCATE TABLE `obras_sociales`;
TRUNCATE TABLE `medicos`;
TRUNCATE TABLE `usuarios`;
TRUNCATE TABLE `especialidades`;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Volcado de datos
-- --------------------------------------------------------

INSERT INTO `especialidades` (`id_especialidad`, `nombre`, `activo`) VALUES
(1, 'PEDIATRÍA', 1), (2, 'CLÍNICA', 1), (3, 'TRAUMATOLOGÍA', 1), (4, 'INFECTOLOGÍA', 1), (9, 'NEUROLOGÍA', 1);

INSERT INTO `usuarios` (`id_usuario`, `documento`, `apellido`, `nombres`, `email`, `contrasenia`, `foto_path`, `rol`, `activo`) VALUES
(1, '31000111', 'Lopez', 'Marcelo', 'lopmar@correo.com', '2a2646782c5b98ee3084c8734c05f870dbd39a8320e0a2d356acb12083d61bef', '', 1, 1),
(2, '31000112', 'Diaz', 'Juan', 'diajua@correo.com', 'efe60972bee3664517525d7abd799fda05ecca0cd4ce583894b86a900782b424', '', 1, 1),
(3, '31000113', 'Benitez', 'Horacio', 'benhor@correo.com', 'eb2209c3ce078113e5dad388f31a6e6d81b3578c500a1dd30a7ebd2d36bed230', '', 1, 1),
(4, '31000114', 'Perez', 'Luis', 'perlui@correo.com', 'e738d2ec597343b44987139c0f056c1341e98f8b3d3814640499a8e74b24a650', '', 1, 1),
(5, '41000111', 'Lopez', 'Jacinto', 'lopjac@correo.com', '79570b42e34bb9e2edc92b9b03982f70653dd11905e7040870a570cfae72b0b0', '', 2, 1),
(6, '41000112', 'Hunk', 'Lorena', 'hunlor@correo.com', '464db19217fabdaabc5add321054f39216d03edfef2efaf8c6769485415b7f25', '', 2, 1),
(7, '41000113', 'Aguirre', 'Brian', 'agubri@correo.com', '2dfa174ae2688ec55d00f57c5a0a7783ba1f0e2981ab7df9f1cf933686c15274', '', 2, 1),
(8, '51000111', 'Fernandez', 'Benito', 'ferben@correo.com', 'f127f4e9e4248f77eaa446ea9bff721e3e79eedf114ba6e1cfc633853ef07b4c', '', 3, 1),
(10, '51000112', 'Gomez', 'Silvia', 'gomsil@correo.com', '601de117008d80e65ffad05dce97462d8f1b1e9aad6d68cf2b289703b8366b52', '', 3, 1);

INSERT INTO `medicos` (`id_medico`, `id_usuario`, `id_especialidad`, `matricula`, `descripcion`, `valor_consulta`) VALUES
(1, 1, 1, 1000, 'test', 5000.00), (2, 2, 1, 2000, 'test', 5000.00), (3, 3, 3, 3000, 'test', 10000.00), (4, 4, 4, 4000, 'test', 15000.00);

INSERT INTO `obras_sociales` (`id_obra_social`, `nombre`, `descripcion`, `porcentaje_descuento`, `es_particular`, `activo`) VALUES
(1, 'Jerárquicos', 'jer', 10.00, 0, 1), (2, 'OSUNER', 'osu', 10.00, 0, 1), (3, 'OSECAC', 'ose', 11.00, 0, 1), (4, 'OSUNER 3', 'OSU', 13.00, 0, 1);

INSERT INTO `medicos_obras_sociales` (`id_medico_obra_social`, `id_medico`, `id_obra_social`, `activo`) VALUES
(1, 1, 1, 1), (2, 2, 1, 1), (3, 3, 2, 1), (4, 4, 3, 1);

INSERT INTO `pacientes` (`id_paciente`, `id_usuario`, `id_obra_social`) VALUES
(1, 5, 1), (2, 6, 2), (3, 7, 3);

INSERT INTO `turnos_reservas` (`id_turno_reserva`, `id_medico`, `id_paciente`, `id_obra_social`, `fecha_hora`, `valor_total`, `atentido`, `activo`) VALUES
(1, 1, 1, 1, '2026-04-01 17:00:00', 4500.00, 0, 1), (2, 3, 2, 2, '2026-04-01 18:00:00', 9000.00, 0, 1), (4, 4, 3, 3, '2026-04-01 19:00:00', 13500.00, 0, 1), (5, 3, 2, 2, '2026-04-14 18:00:00', 9000.00, 0, 1), (6, 3, 2, 2, '2026-04-21 18:00:00', 9000.00, 0, 1), (7, 4, 3, 3, '2026-05-07 16:00:00', 133500.00, 0, 1);