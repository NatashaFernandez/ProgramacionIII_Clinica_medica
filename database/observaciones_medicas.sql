CREATE TABLE observaciones_medicas (
    id_observacion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_turno_reserva INT UNSIGNED NOT NULL,
    observacion TEXT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT UNSIGNED NOT NULL DEFAULT 1,

    CONSTRAINT fk_observaciones_turnos
        FOREIGN KEY (id_turno_reserva)
        REFERENCES turnos_reservas(id_turno_reserva)
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);