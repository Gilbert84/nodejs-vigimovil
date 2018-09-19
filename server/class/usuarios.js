class Usuarios {

    constructor() {
        this.usuarios = [];
    }

    agregarUsuario(usuario) {

        this.usuarios.push(usuario);
        return this.usuarios;
    }

    obtenerUsuario(socket_id) {

        let usuario = this.usuarios.filter(usuario => usuario.socket_id === socket_id)[0];
        return usuario;
    }

    obtenerUsuarios() {
        return this.usuarios;
    }


    borrarUsuario(socketid) {

        let usuarioBorrado = this.obtenerUsuario(id);

        if (usuarioBorrado !== undefined) {

            this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
        }

        return personaBorrada;

    }

    agregarPersonaPorRole(id, persona) {
        switch (persona.role) {
            case 'ADMIN_ROLE':
                let personas = this.agregarPersona(id, persona, null);
                return personas;
            default:
                return;
        }
    }


}


module.exports = {
    Usuarios
}