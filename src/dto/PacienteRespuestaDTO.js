export default class PacienteRespuestaDTO {

    constructor(paciente) {

        this.id_paciente = paciente.id_paciente;
        this.id_usuario = paciente.id_usuario;

        this.documento = paciente.documento;
        this.apellido = paciente.apellido;
        this.nombres = paciente.nombres;
        this.email = paciente.email;

        this.id_obra_social = paciente.id_obra_social;
        this.obra_social = paciente.obra_social;

        this.foto_path = paciente.foto_path;
    }

}