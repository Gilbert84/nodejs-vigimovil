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

    socket.on('entrarChat', (data, callback) => {

        console.log('entro el usuario:',data);
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

    socket.on('entrarDev', (data, callback)=>{
        console.log('entro el dispositivo:',data);
        dispositivos.dataSocketDev(socket,data,callback);
    });



    socket.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(socket.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        socket.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });


    socket.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(socket.id);

        socket.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`));
        socket.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));


    });

    // Mensajes privados
    socket.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(socket.id);
        socket.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });

});