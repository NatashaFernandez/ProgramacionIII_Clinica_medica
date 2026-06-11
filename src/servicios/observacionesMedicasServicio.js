import ObservacionesMedicas from '../db/observacionesMedicas.js';

export default class ObservacionesMedicasServicio {

    constructor() {
        this.observaciones = new ObservacionesMedicas();
    }

    agregar = async (id_turno_reserva, observacion) => {

        const id = await this.observaciones.agregar(
            id_turno_reserva,
            observacion
        );

        return {
            mensaje: 'Observación registrada correctamente',
            id_observacion: id
        };
    };

    buscarPorTurno = async (id_turno_reserva) => {

        return await this.observaciones.buscarPorTurno(
            id_turno_reserva
        );
    };

}