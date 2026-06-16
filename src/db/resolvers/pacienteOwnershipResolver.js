import Pacientes from '../pacientes.js';

const pacientesDB = new Pacientes();

export const pacienteOwnershipResolver =
    async (req, res) => {

        return await pacientesDB.esPacienteDeMedico(
        req.user.id,
        req.params.id
    );
};