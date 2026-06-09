import ObrasSocialesServicio from '../servicios/obrasSocialesServicio.js';

const obrasSocialesServicio = new ObrasSocialesServicio();

export const listarObrasSociales = async (req, res) => {
    try {

        const results = await obrasSocialesServicio.listar();

        res.status(200).json(results);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

export const obtenerObraSocial = async (req, res) => {
    try {

        const { id } = req.params;

        const obraSocial = await obrasSocialesServicio.obtenerPorId(id);

        if (!obraSocial) {

            return res.status(404).json({
                mensaje: 'Obra social no encontrada'
            });

        }

        res.status(200).json(obraSocial);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

export const agregarObraSocial = async (req, res) => {
    try {

        const {
            nombre,
            descripcion,
            porcentaje_descuento,
            es_particular
        } = req.body;

        const obraSocial = await obrasSocialesServicio.agregar(
            nombre,
            descripcion,
            porcentaje_descuento,
            es_particular || 0
        );

        res.status(201).json({
            mensaje: 'Obra social agregada con éxito',
            obra_social: obraSocial
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

export const actualizarObraSocial = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            nombre,
            descripcion,
            porcentaje_descuento,
            es_particular
        } = req.body;

        const obraSocial = await obrasSocialesServicio.actualizar(
            id,
            nombre,
            descripcion,
            porcentaje_descuento,
            es_particular
        );

        res.status(200).json({
            mensaje: 'Obra social actualizada correctamente',
            obra_social: obraSocial
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

export const eliminarObraSocial = async (req, res) => {
    try {

        const { id } = req.params;

        await obrasSocialesServicio.eliminar(id);

        res.status(202).json({
            mensaje: 'Obra social eliminada (desactivada)',
            id_obra_social: id
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};
