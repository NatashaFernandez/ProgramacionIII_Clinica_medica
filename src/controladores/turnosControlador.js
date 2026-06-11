import db from '../configuracion/db.js';

import Turnos from '../db/turnos.js';
import { calcularValorTotal } from '../servicios/turnosServicio.js';
import TurnoRespuestaDTO from '../dto/TurnoRespuestaDTO.js';

const turnosDB = new Turnos();


// PACIENTE - Crear reserva propia
export const crearTurno = async (req, res) => {

    try {

        const {
            fecha_hora,
            id_medico
        } = req.body;

        const id_usuario = req.user.id;

        const paciente =
            await turnosDB.obtenerPacientePorUsuario(
                id_usuario
            );

        if (!paciente) {

            return res.status(404).json({
                error: 'Paciente no encontrado'
            });
        }

        const existeMedico =
            await turnosDB.existeMedico(
                id_medico
            );

        if (!existeMedico) {

            return res.status(404).json({
                error: 'Médico no encontrado'
            });
        }

        const medico =
         await turnosDB.obtenerMedico(
            id_medico
        );

        const obraSocial =
        await turnosDB.obtenerObraSocial(
            paciente.id_obra_social
        );
        
        const valorTotal = calcularValorTotal(
        medico.valor_consulta,
        obraSocial.porcentaje_descuento,
        obraSocial.es_particular);

        const ocupado =
            await turnosDB.turnoOcupado(
                fecha_hora,
                id_medico
            );

        if (ocupado) {

            return res.status(400).json({
                error: 'Ese turno ya está reservado'
            });
        }

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
            paciente.id_paciente,
            paciente.id_obra_social,
            fecha_hora,
            valorTotal,
            0,
             1
            ]
        );

        const turnoCreado =
            await turnosDB.buscarPorId(
                resultado.insertId
            );

        return res.status(201).json({
            mensaje: 'Turno reservado correctamente',
            turno: new TurnoRespuestaDTO(
                turnoCreado
            )
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
};


// ADMIN - Crear turno para cualquier paciente
export const crearTurnoAdmin = async (
    req,
    res
) => {

    try {

        const {
            fecha_hora,
            id_medico,
            id_paciente
        } = req.body;

        const existeMedico =
            await turnosDB.existeMedico(
                id_medico
            );

        if (!existeMedico) {

            return res.status(404).json({
                error: 'Médico no encontrado'
            });
        }

        const paciente =
            await turnosDB.existePaciente(
                id_paciente
            );

        if (!paciente) {

            return res.status(404).json({
                error: 'Paciente no encontrado'
            });
        }
        const medico =
            await turnosDB.obtenerMedico(
                id_medico
            );

        const obraSocial =
             await turnosDB.obtenerObraSocial(
                paciente.id_obra_social
            );

        const valorTotal = calcularValorTotal(
                 medico.valor_consulta,
                obraSocial.porcentaje_descuento,
                obraSocial.es_particular
            );

        const ocupado =
            await turnosDB.turnoOcupado(
                fecha_hora,
                id_medico
            );

        if (ocupado) {

            return res.status(400).json({
                error: 'Ese turno ya está reservado'
            });
        }

<<<<<<< HEAD
=======
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
>>>>>>> origin/main
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
<<<<<<< HEAD
        
            [
                id_medico,
                id_paciente,
                paciente.id_obra_social,
                fecha_hora,
                valorTotal,
                0,
                1
            ]
=======
          [
    id_medico,
    id_paciente,
    id_obra_social,
    fecha_hora,
    valor_total,
    0,
    1
]
>>>>>>> origin/main
        );

        const turnoCreado =
            await turnosDB.buscarPorId(
                resultado.insertId
            );

        return res.status(201).json({
            mensaje:
                'Turno creado por administrador',
            turno:
                new TurnoRespuestaDTO(
                    turnoCreado
                )
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
};


// MÉDICO Y PACIENTE - Ver sus turnos
export const listarMisTurnos = async (
    req,
    res
) => {

    try {

        const id_usuario =
            req.user.id;

        const rol =
            req.user.rol;

        let query = '';
        let values = [];

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

        } else if (rol === 2) {

            query = `
                SELECT tr.*
                FROM turnos_reservas tr
                INNER JOIN pacientes p
                    ON tr.id_paciente = p.id_paciente
                WHERE p.id_usuario = ?
                AND tr.activo = 1
            `;

            values = [id_usuario];
            
        }else if (rol === 3) {

    const [resultados] = await db.query(`
        SELECT *
        FROM turnos_reservas
        WHERE activo = 1
    `);

    return res.status(200).json(
        resultados.map(
            turno => new TurnoRespuestaDTO(turno)
        )
    );

} 

         else {

            return res.status(403).json({
                error:
                    'Rol no autorizado'
            });
        }

        const [resultados] =
            await db.query(
                query,
                values
            );

        return res.status(200).json(
            resultados.map(
                turno =>
                    new TurnoRespuestaDTO(
                        turno
                    )
            )
        );

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
};


// MÉDICO - Marcar turno como atendido
export const marcarAtendido = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const turno =
            await turnosDB.buscarPorId(
                id
            );

        if (!turno) {

            return res.status(404).json({
                error:
                    'Turno no encontrado'
            });
        }

        await db.query(
            `UPDATE turnos_reservas
             SET atentido = 1
             WHERE id_turno_reserva = ?`,
            [id]
        );

        const actualizado =
            await turnosDB.buscarPorId(
                id
            );

        return res.status(200).json({
            mensaje:
                'Turno marcado como atendido',
            turno:
                new TurnoRespuestaDTO(
                    actualizado
                )
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
};