export default class UsuarioRespuestaDTO {

    constructor(usuario) {

        this.id_usuario = usuario.id_usuario;

        this.documento = usuario.documento;
        this.apellido = usuario.apellido;
        this.nombres = usuario.nombres;

        this.email = usuario.email;

        this.foto_path = usuario.foto_path;

        this.rol = usuario.rol;

        this.activo = usuario.activo;
    }

}