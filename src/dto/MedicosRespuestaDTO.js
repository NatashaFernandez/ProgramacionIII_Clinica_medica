export default class MedicosRespuestaDTO {

    constructor(objeto){
        this.id_medico = objeto.id_medico;
        this.id_usuario = objeto.id_usuario;
        this.apellido = objeto.apellido;
        this.nombres = objeto.nombres;
        this.email = objeto.email;
        this.foto_path = objeto.foto_path;
        this.id_especialidad = objeto.id_especialidad;
        this.especialidad = objeto.especialidad;
        this.matricula = objeto.matricula;
        this.descripcion = objeto.descripcion;
        this.valor_consulta = objeto.valor_consulta;
    }

}
