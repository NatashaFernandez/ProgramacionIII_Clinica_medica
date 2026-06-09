import Especialidades from '../db/especialidades.js';

export default class EspecialidadesServicio {

    constructor() {
        this.especialidades = new Especialidades();
    }

    listar = async () => {
        return await this.especialidades.buscarTodas();
    };

    obtenerPorId = async (id) => {
        return await this.especialidades.buscarPorId(id);
    };

    agregar = async (nombre) => {

        const id = await this.especialidades.agregar(nombre);

        return await this.especialidades.buscarPorId(id);
    };

    actualizar = async (id, nombre) => {

        return await this.especialidades.actualizar(
            id,
            nombre
        );
    };

    eliminar = async (id) => {

        return await this.especialidades.eliminar(id);
    };

}