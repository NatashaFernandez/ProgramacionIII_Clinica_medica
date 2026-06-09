import EspecialidadesServicio from '../servicios/especialidadesServicio.js';

const especialidadesServicio = new EspecialidadesServicio();

// B - Browse: Listar todas
export const listarEspecialidades = async (req, res) => {
    try {

        const results = await especialidadesServicio.listar();

        res.status(200).json(results);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

// R - Read: Obtener una sola por ID
export const obtenerEspecialidad = async (req, res) => {
    try {

        const { id } = req.params;

        const especialidad = await especialidadesServicio.obtenerPorId(id);

        if (!especialidad) {

            return res.status(404).json({
                mensaje: 'Especialidad no encontrada'
            });

        }

        res.status(200).json(especialidad);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

// E - Edit: Actualizar datos
export const actualizarEspecialidad = async (req, res) => {
    try {

        const { id } = req.params;
        const { nombre } = req.body;

        const especialidad = await especialidadesServicio.actualizar(
            id,
            nombre
        );

        res.status(200).json({
            mensaje: 'Especialidad actualizada correctamente',
            especialidad
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

// A - Add: Agregar una
export const agregarEspecialidad = async (req, res) => {
    try {

        const { nombre } = req.body;

        const especialidad = await especialidadesServicio.agregar(nombre);

        res.status(201).json({
            mensaje: 'Especialidad agregada con éxito',
            especialidad
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

// D - Delete: Borrado lógico
export const eliminarEspecialidad = async (req, res) => {
    try {

        const { id } = req.params;

        await especialidadesServicio.eliminar(id);

        res.status(202).json({
            mensaje: 'Especialidad eliminada (desactivada)',
            id_especialidad: id
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};