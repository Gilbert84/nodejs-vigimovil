var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../../config/google.config').SEED;

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var Asignacion = require('../../models/despacho/asignacion.model');


// ==========================================
// Obtener todos los asignaciones
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Asignacion.find({})
        .skip(desde)
        .limit(5)
        .populate('operario')
        .populate('vehiculo')
        .exec(
            (err, asignaciones) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando asignacion',
                        errors: err
                    });
                }


                Asignacion.populate(asignaciones, { path: 'operario.empresa vehiculo.empresa', select: 'nombre img', model: 'Empresa' },
                    (error, asignaciones) => {
                        Asignacion.count({}, (err, conteo) => {
                            res.status(200).json({
                                ok: true,
                                asignaciones: asignaciones,
                                total: conteo
                            });

                        });
                    });


            });
});

// ==========================================
// Obtener asignacion
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Asignacion.findById(id)
        .populate('operario')
        .populate('vehiculo')
        .exec((err, asignacion) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar asignacion',
                    errors: err
                });
            }

            if (!asignacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El asignacion con el id ' + id + ' no existe',
                    errors: { message: 'No existe un asignacion con ese ID' }
                });
            }

            Asignacion.populate(asignacion, [
                    { path: 'operario.empresa vehiculo.empresa vehiculo.dispositivo', select: 'nombre img', model: 'Empresa' },
                    { path: 'vehiculo.dispositivo', select: 'socket_id', model: 'Dispositivo' }
                ],
                (error, tipo) => {
                    res.status(200).json({
                        ok: true,
                        asignacion: asignacion
                    });
                });

        })


});

// ==========================================
// Actualizar Asignacion
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Asignacion.findById(id, (err, asignacion) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar asignacion',
                errors: err
            });
        }

        if (!asignacion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El asignacion con el id ' + id + ' no existe',
                errors: { message: 'No existe un asignacion con ese ID' }
            });
        }

        asignacion.fechaHora = new Date();
        asignacion.disponible = body.disponible;
        asignacion.usuario = req.usuario._id;
        asignacion.operario = body.operario;
        asignacion.vehiculo = body.vehiculo;


        asignacion.save((err, asignacionGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar asignacion',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                asignacion: asignacionGuardada
            });

        });

    });

});



// ==========================================
// Crear un nuevo asignacion
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var asignacion = new Asignacion({
        fechaHora: new Date(),
        disponible: body.disponible,
        usuario: req.usuario._id,
        operario: body.operario,
        vehiculo: body.vehiculo
    });

    asignacion.save((err, asignacionGuardada) => {

        if (err) {
            console.log('error', err);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear asignacion',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            asignacion: asignacionGuardada
        });


    });

});


// ============================================
//   Borrar un asignacion por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Asignacion.findByIdAndRemove(id, (err, asignacionBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar asignacion',
                errors: err
            });
        }

        if (!asignacionBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un asignacion con ese id',
                errors: { message: 'No existe un asignacion con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            asignacion: asignacionBorrada
        });

    });


});


module.exports = app;