import db from '../configuracion/db.js';


// PACIENTE - Crear reserva propia
export const crearTurno = async (req, res) => {

    try {

        const { fecha_hora, id_medico } = req.body;

        // Usuario logueado desde JWT
        const id_usuario = req.user.id;

        // Buscar paciente asociado al usuario
        const [paciente] = await db.query(
            `SELECT id_paciente, id_obra_social
             FROM pacientes
             WHERE id_usuario = ?`,
            [id_usuario]
        );

        if (paciente.length === 0) {

            return res.status(404).json({
                error: 'Paciente no encontrado'
            });

        }

        const id_paciente = paciente[0].id_paciente;
        const id_obra_social = paciente[0].id_obra_social;

        // Verificar médico existente
        const [medico] = await db.query(
            `SELECT *
             FROM medicos
             WHERE id_medico = ?`,
            [id_medico]
        );

        if (medico.length === 0) {

            return res.status(404).json({
                error: 'Médico no encontrado'
            });

        }

        // Verificar turno ocupado
        const [turnoExistente] = await db.query(
            `SELECT *
             FROM turnos_reservas
             WHERE fecha_hora = ?
             AND id_medico = ?
             AND activo = 1`,
            [fecha_hora, id_medico]
        );

        if (turnoExistente.length > 0) {

            return res.status(400).json({
                error: 'Ese turno ya está reservado'
            });

        }

        // Crear turno
        const [resultado] = await db.query(
            `INSERT INTO turnos_reservas
            (
                id_medico,
                id_paciente,
                id_obra_social,
                fecha_hora,
                valor_total,
                atentido,
                activo
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                id_medico,
                id_paciente,
                id_obra_social,
                fecha_hora,
                0,
                0,
                1
            ]
        );

        const [turnoCreado] = await db.query(
            `SELECT *
             FROM turnos_reservas
             WHERE id_turno_reserva = ?`,
            [resultado.insertId]
        );

        res.status(201).json({
            mensaje: 'Turno reservado correctamente',
            turno: turnoCreado[0]
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


// ADMIN - Crear turno para cualquier paciente
export const crearTurnoAdmin = async (req, res) => {

    try {

        const {
            fecha_hora,
            id_medico,
            id_paciente
        } = req.body;

        // Verificar médico
        const [medico] = await db.query(
            `SELECT *
             FROM medicos
             WHERE id_medico = ?`,
            [id_medico]
        );

        if (medico.length === 0) {

            return res.status(404).json({
                error: 'Médico no encontrado'
            });

        }

        // Verificar paciente
        const [paciente] = await db.query(
            `SELECT *
             FROM pacientes
             WHERE id_paciente = ?`,
            [id_paciente]
        );

        if (paciente.length === 0) {

            return res.status(404).json({
                error: 'Paciente no encontrado'
            });

        }

        const id_obra_social = paciente[0].id_obra_social;

        // Verificar turno ocupado
        const [turnoExistente] = await db.query(
            `SELECT *
             FROM turnos_reservas
             WHERE fecha_hora = ?
             AND id_medico = ?
             AND activo = 1`,
            [fecha_hora, id_medico]
        );

        if (turnoExistente.length > 0) {

            return res.status(400).json({
                error: 'Ese turno ya está reservado'
            });

        }

        // Obtener datos de la obra social
const [obraSocial] = await db.query(
    `SELECT porcentaje_descuento, es_particular
     FROM obras_sociales
     WHERE id_obra_social = ?`,
    [id_obra_social]
);

let valor_total = Number(medico[0].valor_consulta);

if (
    obraSocial.length > 0 &&
    obraSocial[0].es_particular === 0
) {
    valor_total =
        valor_total -
        (valor_total * Number(obraSocial[0].porcentaje_descuento) / 100);
}

        // Crear turno
        const [resultado] = await db.query(
            `INSERT INTO turnos_reservas
            (
                id_medico,
                id_paciente,
                id_obra_social,
                fecha_hora,
                valor_total,
                atentido,
                activo
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
    id_medico,
    id_paciente,
    id_obra_social,
    fecha_hora,
    valor_total,
    0,
    1
]
        );

        const [turnoCreado] = await db.query(
            `SELECT *
             FROM turnos_reservas
             WHERE id_turno_reserva = ?`,
            [resultado.insertId]
        );

        res.status(201).json({
            mensaje: 'Turno creado por administrador',
            turno: turnoCreado[0]
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


// MÉDICO Y PACIENTE - Ver sus turnos
export const listarMisTurnos = async (req, res) => {

    try {

        const id_usuario = req.user.id;
        const rol = req.user.rol;

        let query = '';
        let values = [];

        // MÉDICO
        if (rol === 1) {

            query = `
                SELECT tr.*
                FROM turnos_reservas tr
                INNER JOIN medicos m
                    ON tr.id_medico = m.id_medico
                WHERE m.id_usuario = ?
                AND tr.activo = 1
            `;

            values = [id_usuario];

        }

        // PACIENTE
        else if (rol === 2) {

            query = `
                SELECT tr.*
                FROM turnos_reservas tr
                INNER JOIN pacientes p
                    ON tr.id_paciente = p.id_paciente
                WHERE p.id_usuario = ?
                AND tr.activo = 1
            `;

            values = [id_usuario];

        }

        else {

            return res.status(403).json({
                error: 'Rol no autorizado'
            });

        }

        const [resultados] = await db.query(query, values);

        res.status(200).json(resultados);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


// MÉDICO - Marcar turno como atendido
export const marcarAtendido = async (req, res) => {

    try {

        const { id } = req.params;

        const [turno] = await db.query(
            `SELECT *
             FROM turnos_reservas
             WHERE id_turno_reserva = ?
             AND activo = 1`,
            [id]
        );

        if (turno.length === 0) {

            return res.status(404).json({
                error: 'Turno no encontrado'
            });

        }

        await db.query(
            `UPDATE turnos_reservas
             SET atentido = 1
             WHERE id_turno_reserva = ?`,
            [id]
        );

        const [turnoActualizado] = await db.query(
            `SELECT *
             FROM turnos_reservas
             WHERE id_turno_reserva = ?`,
            [id]
        );

        res.status(200).json({
            mensaje: 'Turno marcado como atendido',
            turno: turnoActualizado[0]
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
