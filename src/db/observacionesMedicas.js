import db from '../configuracion/db.js';

export default class ObservacionesMedicas {

    agregar = async (id_turno_reserva, observacion) => {

        const [resultado] = await db.query(
            `
            INSERT INTO observaciones_medicas
            (
                id_turno_reserva,
                observacion
            )
            VALUES
            (
                ?,
                ?
            )
            `,
            [
                id_turno_reserva,
                observacion
            ]
        );

        return resultado.insertId;
    };

    buscarPorTurno = async (id_turno_reserva) => {

        const [observaciones] = await db.query(
            `
            SELECT
                id_observacion,
                id_turno_reserva,
                observacion,
                fecha
            FROM observaciones_medicas
            WHERE id_turno_reserva = ?
              AND activo = 1
            ORDER BY fecha DESC
            `,
            [id_turno_reserva]
        );

        return observaciones;
    };

}