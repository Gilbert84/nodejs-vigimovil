var Asignacion = require('../models/despacho/asignacion.model');

class Asignaciones {


    constructor() {
        this.asignaciones = [];
    }

    actualizar(asignaciones) {
        return this.asignaciones = asignaciones;
    }

    obtener() {
        return new Promise((resolve, reject) => {
            Asignacion.find({})
                .populate('operario')
                .populate('vehiculo')
                .exec(
                    (err, asignaciones) => {

                        if (err) {
                            reject({
                                ok: false,
                                mensaje: 'Error cargando asignaciones',
                                errors: err
                            });
                        }


                        Asignacion.populate(asignaciones, { path: 'operario.empresa vehiculo.empresa', select: 'nombre img', model: 'Empresa' },
                            (error, asignaciones) => {

                                if (error) {
                                    reject({
                                        ok: false,
                                        mensaje: 'Error populando asignaciones',
                                        errors: error
                                    });
                                }

                                this.asignaciones = asignaciones;
                                Asignacion.count({}, (err, conteo) => {
                                    resolve({
                                        ok: true,
                                        asignaciones: asignaciones,
                                        total: conteo
                                    });

                                });
                            });

                    });
        });

    }

    obtenerViajeOperario(_id) {
        let viaje = this.asignaciones.filter(viaje => {
            return viaje.operario._id === _id;
        })[0];
        return viaje;
    }

    filtrar() {
        return this.asignaciones = this.asignaciones.filter(asignacion => {
            return asignacion.disponible != false;
        });
    }

}


module.exports = {
    Asignaciones
}