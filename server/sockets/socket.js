var { io } = require('../server');
var { ControlFlota } = require('../class/control-flota');
var { Usuarios } = require('../class/usuarios');
var { Dispositivos } = require('../class/dispositivo.class');
var Dispositivo = require('../models/dispositivo.model');


let controlFlota = new ControlFlota();



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

    //dispositivo previamente registrado y en linea
    socket.on('onlineDispositivo', (dispositivo, callback) => {
        console.log('en linea', dispositivo);

    });

    socket.on('registroDispositivo', (dispositivo, callback) => {
        console.log('dispositivo nuevo', dispositivo);
        dispositivo.socket_id = socket.id;
        dispositivos.crearDispositivo(dispositivo)
            .then((resp) => {
                callback(resp); //devuelvo el callback al dispositivo
            })
            .catch((err) => {
                callback(err); //devuelvo el callback al dispositivo
            });

        //dispositivos.validarData(socket, data); // validamos la info
        //socket.broadcast.to(data.ruta).emit('listaDispositivo', dispositivos.getDispositivoPorRuta(data.ruta));
        //socket.broadcast.to(data.ruta).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));
        //callback(dispositivos.getDispositivoPorRuta(data.ruta));
        //socket.emit('mensajeDispositivo', crearMensaje('Administrador', `${ dispositivo.nombre } entro`));
    });



    socket.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(socket.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        socket.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });




    // Mensajes privados
    socket.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(socket.id);
        socket.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });


    socket.on('siguienteTiket', (data, callback) => {
        let siguiente = controlFlota.siguienteDespacho();
        console.log(siguiente);
        callback(siguiente);
    });

    socket.on('atenderDespacho', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'el escritorio es necesario'
            });
        }

        let atenderDespacho = controlFlota.atenderDespacho(data.escritorio);

        callback(atenderDespacho);


    });


    socket.emit('estadoActual', { actual: controlFlota.obtenerUltimoDespacho() });


    //ejecutamos limpieza de clientes y dispositivos
    socket.on('disconnect', () => {

        var personaBorrada = usuarios.borrarPersona(socket.id);
        //var dispositivoBorrado = dispositivos.borrarDispositivo(socket.id);

        if (personaBorrada != undefined) {
            socket.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`));
            socket.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
        } //else if (dispositivoBorrado != undefined) {
        //socket.broadcast.to(dispositivoBorrado.ruta).emit('crearMensaje', crearMensaje('Administrador', `${ dispositivoBorrado.nombre } salió`));
        //socket.broadcast.to(dispositivoBorrado.ruta).emit('listaPersona', usuarios.getPersonasPorSala(dispositivoBorrado.ruta));
        //}

        socket.broadcast.emit('crearMensaje', { server: 'Administrador', mensaje: `${'salio'+ socket.id}` });

        //console.log('salio id: ', socket.id);

    });

});