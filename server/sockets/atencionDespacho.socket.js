var { io } = require('../server');
var { Asignaciones } = require('../class/asignacion.class');

const asignaciones = new Asignaciones();

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


});