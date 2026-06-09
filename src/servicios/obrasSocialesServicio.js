import ObrasSociales from '../db/obrasSociales.js';

export default class ObrasSocialesServicio {

    constructor() {
        this.obrasSociales = new ObrasSociales();
    }

    listar = async () => {
        return await this.obrasSociales.listar();
    };

    obtenerPorId = async (id) => {
        return await this.obrasSociales.obtenerPorId(id);
    };

    agregar = async (
        nombre,
        descripcion,
        porcentaje_descuento,
        es_particular
    ) => {

        const id = await this.obrasSociales.agregar(
            nombre,
            descripcion,
            porcentaje_descuento,
            es_particular
        );

        return await this.obrasSociales.obtenerPorId(id);
    };

    actualizar = async (
        id,
        nombre,
        descripcion,
        porcentaje_descuento,
        es_particular
    ) => {

        return await this.obrasSociales.actualizar(
            id,
            nombre,
            descripcion,
            porcentaje_descuento,
            es_particular
        );
    };

    eliminar = async (id) => {

        return await this.obrasSociales.eliminar(id);
    };

}