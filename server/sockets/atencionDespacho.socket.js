var { io } = require('../server');
var { Asignaciones }  = require('../class/asignacion.class');

const asignaciones = new Asignaciones();

io.on('connection', (socket) => {

    socket.on('actualizarAsignaciones', (data, callback) => {

        let asignacionesActuales = asignaciones.actualizar(data);

        socket.broadcast.emit('asigancionesActulaes',asignacionesActuales);

        console.log('asignaciones actuales:',asignacionesActuales);

        callback({
            ok:true,
            mensaje:'server: asignaciones recibidas'
        });
    });

    socket.on('obtenerAsignaciones', (data, callback) => {
        callback(asignaciones.obtener());
    });


});