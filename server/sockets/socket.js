var { io } = require('../server');
var { Usuarios } = require('../class/usuarios');
var { Dispositivos } = require('../class/devices');


var crearMensaje = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };

}

const usuarios = new Usuarios();
const dispositivos = new Dispositivos();

io.on('connection', (socket) => {

    //console.log('entro id : ', socket.id);

    socket.on('entrarChat', (data, callback) => {

        console.log('entro el usuario:', data);
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        socket.join(data.sala);

        usuarios.agregarPersona(socket.id, data.nombre, data.sala);

        socket.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        socket.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));

        callback(usuarios.getPersonasPorSala(data.sala));

    });

    socket.on('entrarDev', (data, callback) => {
        dispositivos.validarData(socket, data); // validamos la info
        socket.broadcast.to(data.ruta).emit('listaDispositivo', dispositivos.getDispositivoPorRuta(data.ruta));
        socket.broadcast.to(data.ruta).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));
        callback(dispositivos.getDispositivoPorRuta(data.ruta));
    });



    socket.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(socket.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        socket.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });


    socket.on('disconnect', () => {

        var personaBorrada = usuarios.borrarPersona(socket.id);
        var dispositivoBorrado = dispositivos.borrarDispositivo(socket.id);

        if (personaBorrada != undefined) {
            socket.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`));
            socket.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
        } else if (dispositivoBorrado != undefined) {
            socket.broadcast.to(dispositivoBorrado.ruta).emit('crearMensaje', crearMensaje('Administrador', `${ dispositivoBorrado.nombre } salió`));
            socket.broadcast.to(dispositivoBorrado.ruta).emit('listaPersona', usuarios.getPersonasPorSala(dispositivoBorrado.ruta));
        }

        //console.log('salio id: ', socket.id);

    });

    // Mensajes privados
    socket.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(socket.id);
        socket.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });

});