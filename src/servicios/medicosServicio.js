import Medicos from '../db/medicos.js';
import MedicosRespuestaDTO from '../dto/MedicosRespuestaDTO.js';

export default class MedicosServicio {

    constructor() {
        this.medicos = new Medicos();
    }

    buscarTodos = async () => {

        const datos = await this.medicos.buscarTodos();

        return datos.map(
            medico => new MedicosRespuestaDTO(medico)
        );
    };

    buscarPorId = async (id_medico) => {

        const medico = await this.medicos.buscarPorId(id_medico);

        if (!medico) {
            return null;
        }

        return new MedicosRespuestaDTO(medico);
    };

    buscarObrasSociales = async (id_medico) => {
        return await this.medicos.buscarObrasSociales(id_medico);
    };

    asociarObrasSociales = async (id_medico, obras_sociales) => {
        return await this.medicos.relacionarConObraSocial(
            id_medico,
            obras_sociales
        );
    };

    actualizarEspecialidad = async (
        id_medico,
        id_especialidad
    ) => {

        return await this.medicos.actualizarEspecialidad(
            id_medico,
            id_especialidad
        );
    };
}
