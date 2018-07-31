var { io } = require('../server');
var { ControlDespacho } = require('../class/control-despacho');
var { Usuarios } = require('../class/usuarios');
var Dispositivo = require('../models/dispositivo.model');


var { Asignaciones } = require('../class/asignacion.class');
var { Dispositivos, Database } = require('../class/dispositivo.class');
var { ViajeDB } = require('../class/viajeDB.class');

var usuarios = new Usuarios();
var asignaciones = new Asignaciones();
var dispositivos = new Dispositivos();
var database = new Database();
var viajeDB = new ViajeDB();
var controlDespacho = new ControlDespacho();

var despacho;



var crearMensaje = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };

}

io.on('connection', (socket) => {


    socket.on('actualizarAsignaciones', (data, callback) => {

        asignaciones.obtener().then((asignacionesActuales) => {
            socket.broadcast.emit('asigancionesActulaes', asignacionesActuales);
            callback(asignacionesActuales);
        });
    });
    socket.on('obtenerAsignaciones', (data, callback) => {
        asignaciones.obtener().then((resp) => {
            callback(resp);
        });
    });

    socket.on('obtenerViajeOperario', (operario, callback) => {
        if (!operario._id) {
            callback({ error: true, server: 'el id es requerido' });
        }
        let viajeOperario = asignaciones.obtenerViajeOperario(operario._id);
        callback(viajeOperario);
    });

    socket.on('dispositivoConectado', (dispositivo, callback) => {
        //let dispositivo = JSON.parse(data);
        dispositivo.socket_id = socket.id;
        if (!dispositivo._id) {
            return callback({ ok: false, server: 'el id es requerido' })
        }

        database.actualizar(dispositivo).then((resp) => {
            let dispositivosActuales = dispositivos.agregar(dispositivo);
            socket.broadcast.emit('listaActualDispositivos', dispositivosActuales);
            callback(resp);
        });

    });

    socket.on('dispositivoMensajeTodos', data => {
        let dispositivo = dispositivos.obtnerUno(socket.id);
        let mensaje = {
            dispositivo: dispositivo,
            mensaje: data
        }
        socket.broadcast.emit('dispositivoMensajeTodos', mensaje); //mensaje global 
    });

    socket.on('asignarNuevoViaje', (data, callback) => {
        let dispositivoObtenido = dispositivos.obtnerUno(socket.id);
        let mensaje = {
            ok: true,
            de: socket.id,
            para: data.para,
            viaje: data.viaje
        };

        if (data.viaje.estado.codigo === 0) {
            despacho = controlDespacho.siguienteDespacho();
        }

        socket.broadcast.to(mensaje.para).emit('asignarNuevoViaje', mensaje);
        callback({
            ok: true,
            server: {
                mensaje: 'datos sincronizados',
                despacho: despacho
            }
        });
    });

    socket.on('confirmacionAsignacion', (data, callback) => {
        let usuarioObtenido = usuarios.obtenerPersona(socket.id);
        let confirmacionAsignacion = {
            ok: true,
            de: socket.id,
            mensaje: data.mensaje
        };
        socket.broadcast.to(data.para).emit('confirmacionAsignacion', confirmacionAsignacion);
        callback({
            ok: true,
            server: 'datos sincronizados'
        });
    });

    socket.on('actualizarViaje', (viaje, callback) => {
        if (!viaje._id) {
            callback({ ok: false, server: 'el id es requerido' });
        }
        viajeDB.actualizarViaje(viaje).then((resp) => {
            callback(resp);
        });
    });

    socket.on('actualizarViajeEstado', (viaje, callback) => {
        viajeDB.actualizarEstado(viaje).then((resp) => {
            callback(resp);
        });
    });

    socket.on('ingresoUsuario', (data, callback) => {

        if (!data) {
            return callback({
                error: true,
                server: {
                    mensaje: 'el usuario es obligatorio',
                    codigo: 400
                }
            });
        }

        callback(usuarios.agregarPersonaPorRole(socket.id, data.usuario));
        socket.broadcast.emit('listaActualUsuarios', usuarios.obtenerPersonas());

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
        //console.log('en linea', dispositivo);

    });

    socket.on('registroDispositivo', (dispositivo, callback) => {
        //console.log('dispositivo nuevo', dispositivo);
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

    socket.on('atenderDespacho', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'el escritorio es necesario'
            });
        }

        let atenderDespacho = controlDespacho.atenderDespacho(data.escritorio);

        callback(atenderDespacho);


    });


    socket.emit('estadoActual', { actual: controlDespacho.obtenerUltimoDespacho() });


    //ejecutamos limpieza de clientes y dispositivos
    socket.on('disconnect', function() {


        var personaBorrada = usuarios.borrarPersona(socket.id);
        var dispositivoBorrado = dispositivos.borrarDispositivo(socket.id);

        if (personaBorrada !== undefined) {
            socket.broadcast.emit('usuarioDesconectado', crearMensaje('Administrador', socket.id + 'salió'));
            socket.broadcast.emit('listaActualUsuarios', usuarios.obtenerPersonas());
            //socket.broadcast.to(personaBorrada.sala).emit('usuarioDesconectado', crearMensaje('Administrador', 'personaBorrada.nombre ' + 'salió'));
            //socket.broadcast.to(personaBorrada.sala).emit('listaActualUsuarios', usuarios.getPersonasPorSala(personaBorrada.sala));
        } else if (dispositivoBorrado !== undefined) {
            socket.broadcast.emit('dispositivoDesconectado', crearMensaje('Administrador', socket.id + 'salió'));
            socket.broadcast.emit('listaActualDispositivos', dispositivos.obtenerTodos());
        }

    });

});