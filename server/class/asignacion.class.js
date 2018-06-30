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
                                mensaje: 'Error cargando asignacion',
                                errors: err
                            });
                        }


                        Asignacion.populate(asignaciones, { path: 'operario.empresa vehiculo.empresa', select: 'nombre img', model: 'Empresa' },
                            (error, asignaciones) => {

                                this.asignaciones = asignaciones;
                                console.log(this.asignaciones);
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

    filtrar() {
        return this.asignaciones = this.asignaciones.filter(asignacion => {
            return asignacion.disponible != false;
        });
    }

}


module.exports = {
    Asignaciones
}