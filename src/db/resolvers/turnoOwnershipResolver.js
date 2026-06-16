import Turnos from '../Turnos.js';

const turnosDB = new Turnos();

export const turnoOwnershipResolver =
    async (req, res) => {
        try {
            const id_usuario_medico = req.user.id;
            const id_turno = req.params.id;

            console.log(`[turnoOwnershipResolver] Verificando propiedad: Medico ID ${id_usuario_medico}, Turno ID ${id_turno}`);

            const esDuenio = await turnosDB.esTurnoDeMedico(
                id_usuario_medico,
                id_turno
            );

            if (!esDuenio) {
                console.warn(`[turnoOwnershipResolver] Acceso denegado: El turno ${id_turno} no pertenece al médico ${id_usuario_medico}`);
            }

            return esDuenio;
        } catch (error) {
            console.error(`[turnoOwnershipResolver] Error al resolver propiedad del turno:`, error);
            return false;
        }
    };