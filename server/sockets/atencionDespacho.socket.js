var { io } = require('../server');
var { Asignaciones } = require('../class/asignacion.class');
var { Dispositivos, Database } = require('../class/dispositivo.class');
var { ViajeDB } = require('../class/viajeDB.class');

const asignaciones = new Asignaciones();
const dispositivos = new Dispositivos();
const database = new Database();
const viajeDB = new ViajeDB();

io.on('connection', (socket) => {

    console.log('segunda conexion');

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

        if (!dispositivo._id) {
            return callback({ ok: false, server: 'el id es requerido' })
        }

        let dispositivosActuales = dispositivos.agregar(socket.id, dispositivo._id);
        let nuevaData = database.actualizar(socket.id, dispositivo).then((resp) => {

        });


        socket.broadcast.emit('listaDispositivos', dispositivosActuales); // este es ele que escucha el usuario de manera global

        callback(dispositivosActuales);
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
        let dispositivo = dispositivos.obtnerUno(socket.id);
        let mensaje = {
            dispositivo: dispositivo,
            mensaje: data.mensaje,
            para: data.para,
            viaje: data.viaje
        };

        socket.broadcast.to(mensaje.para).emit('asignarNuevoViaje', mensaje);

        callback({ ok: true, server: 'datos recibidos' });
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


    socket.on('disconnect', () => {
        //console.log('dispositivo desconectado', socket.id);

        let dispositivoBorrado = dispositivos.borrar(socket.id);

        socket.broadcast.emit('dispositivoDesconectado', { error: false, server: 'dispositivo con el id: ' + dispositivoBorrado + ' salio!!' })
        socket.broadcast.emit('listaDispositivos', dispositivos.obtenerTodos());
    });


});