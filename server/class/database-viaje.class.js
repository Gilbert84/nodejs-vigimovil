var Viaje = require('../models/despacho/viaje.model');
var Asignacion = require('../models/despacho/asignacion.model');


class DatabaseViaje {
    obtenerTodos() {
        return new Promise((resolve, reject) => {
            Viaje.find({})
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
    // Actualizar Viaje
    // ==========================================
    actualizar(viaje) {

        return new Promise((resolve, reject) => {
            Viaje.findById(viaje._id, (err, viajeEncontrado) => {


                if (err) {
                    resolve({
                        ok: false,
                        mensaje: 'Error al buscar viaje',
                        errors: err
                    });
                    return;
                }

                if (!viajeEncontrado) {
                    resolve({
                        ok: false,
                        mensaje: 'El viaje con el id ' + viaje._id + ' no existe',
                        errors: { message: 'No existe un viaje con ese ID' }
                    });
                    return;
                }
                viajeEncontrado.fechaHoraFin = viaje.fechaHoraFin;
                viajeEncontrado.pasajeros = viaje.pasajeros;
                viajeEncontrado.fechaActualizado = new Date();

                viajeEncontrado.save((err, viajeGuardado) => {

                    if (err) {
                        resolve({
                            ok: false,
                            mensaje: 'Error al actualizar viaje',
                            errors: err
                        });
                    }
                    this.actualizarAsignacion(viaje.asignacion).then((resp) => {
                        if (resp.ok) {
                            resolve({
                                ok: true,
                                mensaje: 'Viaje actualizado y terminado correctamente',
                                viaje: viajeGuardado
                            });
                        }

                    });

                });

            });
        });

    }


    actualizarAsignacion(id) {
        return new Promise((resolve, reject) => {

            Asignacion.findById(id, (err, asignacionEncontrada) => {

                if (err) {
                    resolve({
                        ok: false,
                        mensaje: 'Error al buscar vehiculo',
                        errors: err
                    });
                }

                if (!asignacionEncontrada) {
                    resolve({
                        ok: false,
                        mensaje: 'la asignacion con el id ' + id + ' no existe',
                        errors: { message: 'No existe un asignacion con ese ID' }
                    });
                }

                asignacionEncontrada.disponible = true;

                asignacionEncontrada.save((err, asignacionActualizada) => {

                    if (err) {
                        resolve({
                            ok: false,
                            mensaje: 'Error al actualizar dispositivo',
                            errors: err
                        });
                    }

                    resolve({
                        ok: true,
                        mensaje: 'asignacion nuevamente disponible',
                        asignacion: asignacionActualizada
                    });

                });

            });
        });
    }



}


module.exports = {
    DatabaseViaje
}