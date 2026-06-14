import MedicosServicio from '../servicios/medicosServicio.js';

export default class MedicosControlador {

    constructor() {
        this.medicos = new MedicosServicio();
    }

    buscarTodos = async (req, res) => {

        try {

            const medicos = await this.medicos.buscarTodos();

            res.status(200).json({
                estado: true,
                mensaje: 'Médicos encontrados',
                medicos
            });

        } catch (error) {

            res.status(500).json({
                estado: false,
                mensaje: error.message
            });

        }
    };

    buscarPorId = async (req, res) => {

        try {

            const { id_medico } = req.params;

            const medico = await this.medicos.buscarPorId(
                id_medico
            );

            if (!medico) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Médico no encontrado'
                });
            }

            res.status(200).json({
                estado: true,
                medico
            });

        } catch (error) {

            res.status(500).json({
                estado: false,
                mensaje: error.message
            });

        }
    };

    buscarPorEspecialidad = async (req, res) => {

        try {

            const { id_especialidad } = req.params;

            const medicos =
                await this.medicos.buscarPorEspecialidad(
                    id_especialidad
                );

            res.status(200).json({
                estado: true,
                mensaje: 'Médicos encontrados',
                medicos
            });

        } catch (error) {

            res.status(500).json({
                estado: false,
                mensaje: error.message
            });

        }
    };

    buscarObrasSociales = async (req, res) => {

        try {

            const { id_medico } = req.params;

            const obras =
                await this.medicos.buscarObrasSociales(
                    id_medico
                );

            res.status(200).json({
                estado: true,
                obras_sociales: obras
            });

        } catch (error) {

            res.status(500).json({
                estado: false,
                mensaje: error.message
            });

        }
    };

    asociarObrasSociales = async (req, res) => {

        try {

            const { id_medico } = req.params;
            const { obras_sociales } = req.body;

            const relacion =
                await this.medicos.asociarObrasSociales(
                    id_medico,
                    obras_sociales
                );

            if (!relacion) {
                return res.status(400).json({
                    estado: false,
                    mensaje: 'No fue posible asociar las obras sociales'
                });
            }

            res.status(201).json({
                estado: true,
                mensaje: 'Relaciones creadas correctamente'
            });

        } catch (error) {

            res.status(500).json({
                estado: false,
                mensaje: error.message
            });

        }
    };

    actualizarEspecialidad = async (req, res) => {

        try {

            const { id_medico } = req.params;
            const { id_especialidad } = req.body;

            const actualizado =
                await this.medicos.actualizarEspecialidad(
                    id_medico,
                    id_especialidad
                );

            if (!actualizado) {
                return res.status(404).json({
                    estado: false,
                    mensaje: 'Médico no encontrado'
                });
            }

            res.status(200).json({
                estado: true,
                mensaje: 'Especialidad actualizada correctamente'
            });

        } catch (error) {

            res.status(500).json({
                estado: false,
                mensaje: error.message
            });

        }
    };
}
