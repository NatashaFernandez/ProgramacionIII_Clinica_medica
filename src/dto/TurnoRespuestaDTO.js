export default class TurnoRespuestaDTO {

    constructor(turno) {

        this.id_turno_reserva =
            turno.id_turno_reserva;

        this.id_medico =
            turno.id_medico;

        this.id_paciente =
            turno.id_paciente;

        this.id_obra_social =
            turno.id_obra_social;

        this.fecha_hora =
            turno.fecha_hora;

        this.valor_total =
            turno.valor_total;

        this.atendido =
            turno.atendido;

        this.activo =
            turno.activo;
    }

}