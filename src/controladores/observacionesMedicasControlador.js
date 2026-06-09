import ObservacionesMedicasServicio from '../servicios/observacionesMedicasServicio.js';

const observacionesServicio = new ObservacionesMedicasServicio();

export const agregarObservacion = async (req, res) => {

    try {

        const { id } = req.params;
        const { observacion } = req.body;

        const resultado = await observacionesServicio.agregar(
            id,
            observacion
        );

        res.status(201).json(resultado);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

export const listarObservaciones = async (req, res) => {

    try {

        const { id } = req.params;

        const observaciones =
            await observacionesServicio.buscarPorTurno(id);

        res.status(200).json(observaciones);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};