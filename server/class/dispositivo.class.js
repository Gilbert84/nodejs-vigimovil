var Dispositivo = require('../models/dispositivo.model'); // esquema para grabar directamente en la base de datos 

var crearMensaje = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };

}

class Dispositivos {

    constructor() {
        this.dispositivos = [];
        this.dispositivosConRuta = [];
    }

    agregarDispositivo(id, nombre, ruta) {

        var dispositivo = { id, nombre, ruta };

        this.dispositivos.push(dispositivo);
        //console.log(dispositivo);

        return this.dispositivos;

    }

    // id hace referencia al id unico del socket
    // _id hace referencia al id unico de la base de datos
    agregar(dispositivo) {
        this.dispositivos.push(dispositivo);
        return this.dispositivos;
    }

    obtnerUno(id) {

        let dispositivo = this.dispositivos.filter(dispositivo => {
            return dispositivo.socket_id === id;
        })[0];

        return dispositivo;
    }

    obtenerTodos() {
        return this.dispositivos;
    }

    obtenerPorRuta(ruta) {
        let dispositivosConRuta = this.dispositivos.filter(dispositvo => {
            dispositivo.ruta === ruta;
        });
        return dispositivosConRuta;
    }

    borrar(id) {

        let dispositivoBorrado = this.obtnerUno(id);

        this.dispositivos = this.dispositivos.filter(dispositivo => {
            return dispositivo.id != id;
        });

        return dispositivoBorrado;
    }

    getDispositivo(socket_id) {
        let dispositivo = this.dispositivos.filter(dispositivo => dispositivo.socket_id === socket_id)[0];
        return dispositivo;
    }

    getDispositivos() {
        return this.dispositivos;
    }

    getDispositivoPorRuta(ruta) {
        let dispositivoEnRuta = this.dispositivos.filter(dispositivo => dispositivo.ruta === ruta);
        return dispositivoEnRuta;
    }

    borrarDispositivo(socket_id) {

        let dispositivoBorrado = this.getDispositivo(socket_id);

        this.dispositivo = this.dispositivos.filter(dispositivo => dispositivo.socket_id !== socket_id);

        return dispositivoBorrado;

    }

    validarData(device, data) {

        if (!data.nombre || !data.ruta) {
            return callback({
                error: true,
                mensaje: 'El nombre/ruta es necesario'
            });
        }

        device.join(data.ruta);

        this.agregarDispositivo(device.id, data.nombre, data.ruta);

    };


    crearDispositivo(data) {


        var uuid = data.uuid;


        return new Promise((resolve, reject) => {

            Dispositivo.findOne({ uuid })
                .exec((err, dispositivo) => {

                    if (err) {
                        //console.log('error dispositivo', dispositivo);
                        reject({
                            ok: false,
                            mensaje: 'Error al buscar dispositivo',
                            errors: err
                        });
                    }

                    if (!dispositivo) { //si no existe lo creamos

                        var nuevoDispositivo = new Dispositivo(data);
                        nuevoDispositivo.save((err, dispositivoGuardado) => {


                            if (err) {
                                reject({
                                    ok: false,
                                    server: {
                                        mensaje: 'Error al crear dispositivo',
                                        error: err
                                    },
                                });
                            }

                            resolve({
                                ok: true,
                                server: {
                                    mensaje: 'dispositivo registrado',
                                    dispositivo: dispositivoGuardado
                                }
                            });

                        });
                    }
                    //regreso el registro existente de la base de datos
                    else {
                        resolve({
                            ok: true,
                            server: {
                                mensaje: 'dispositivo ya se encuentra registrado',
                                dispositivo: dispositivo
                            }
                        });
                    }


                })

        });
    }


}

class Database {
    obtenerTodos() {
        return new Promise((resolve, reject) => {
            Dispositivo.find({})
                .exec(
                    (err, dispositivos) => {

                        if (err) {
                            reject({
                                ok: false,
                                mensaje: 'Error cargando dispositivos',
                                errors: err
                            });
                            return;
                        }

                        this.dispositivos = dispositivos;

                    });
        });

    }

    // ==========================================
    // Actualizar Dispositivo
    // ==========================================
    actualizar(dispositivo) {

        return new Promise((resolve, reject) => {
            Dispositivo.findById(dispositivo._id, (err, dispositivoEncontrado) => {

                if (err) {
                    resolve({
                        ok: false,
                        mensaje: 'Error al buscar dispositivo',
                        errors: err
                    });
                }

                if (!dispositivoEncontrado) {
                    resolve({
                        ok: false,
                        mensaje: 'El dispositivo con el id ' + dispositivoEncontrado._id + ' no existe',
                        errors: { message: 'No existe un dispositivo con ese ID' }
                    });
                }

                



                dispositivoEncontrado.socket_id = dispositivo.socket_id;
                dispositivoEncontrado.geoposicion = dispositivo.geoposicion;
                dispositivoEncontrado.fechaActualizado = new Date();
                dispositivoEncontrado.disponible = dispositivo.disponible;

                dispositivoEncontrado.save((err, dispositivoGuardado) => {

                    if (err) {
                        resolve({
                            ok: false,
                            mensaje: 'Error al actualizar dispositivo',
                            errors: err
                        });
                    }


                    resolve({
                        ok: true,
                        mensaje: 'dispositivo actualizado',
                    });

                });

            });
        });

    }
}


module.exports = {
    Dispositivos,
    Database
}