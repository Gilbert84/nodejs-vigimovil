var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/google.config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Vehiculo = require('../models/vehiculo.model');
var Dispositivo = require('../models/dispositivo.model');


// ==========================================
// Obtener todos los vehiculos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Vehiculo.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('empresa', 'nombre')
        .populate('dispositivo','nombre')
        .exec(
            (err, vehiculos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando vehiculo',
                        errors: err
                    });
                }

                Vehiculo.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        vehiculos: vehiculos,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener vehiculo
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Vehiculo.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('empresa')
        .populate('dispositivo','nombre')
        .exec((err, vehiculo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar vehiculo',
                    errors: err
                });
            }

            if (!vehiculo) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehiculo con el id ' + id + ' no existe',
                    errors: { message: 'No existe un vehiculo con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                vehiculo: vehiculo
            });

        })


});

// ==========================================
// Actualizar Vehiculo
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Vehiculo.findById(id, (err, vehiculo) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar vehiculo',
                errors: err
            });
        }

        if (!vehiculo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El vehiculo con el id ' + id + ' no existe',
                errors: { message: 'No existe un vehiculo con ese ID' }
            });
        }


        vehiculo.nombre = body.nombre;
        vehiculo.usuario = req.usuario._id;
        vehiculo.empresa = body.empresa;
        vehiculo.fechaActualizado = new Date();

        vehiculo.save((err, vehiculoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar vehiculo',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                vehiculo: vehiculoGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo vehiculo
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    console.log('vehiculo',req.body);
    var vehiculo = new Vehiculo({
        placa: body.placa,
        interno:body.interno,
        categoria:body.categoria,
        capacidad:body.capacidad,
        usuario: req.usuario._id,
        empresa: body.empresa,
        dispositivo: body.dispositivo,
        modelo:body.modelo
    });
    

    vehiculo.save((err, vehiculoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear vehiculo',
                errors: err
            });
        }


        actualizarDispositivo(body.dispositivo);

        res.status(201).json({
            ok: true,
            vehiculo: vehiculoGuardado
        });


    });

});


// ============================================
//   Borrar un vehiculo por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Vehiculo.findByIdAndRemove(id, (err, vehiculoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar vehiculo',
                errors: err
            });
        }

        if (!vehiculoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un vehiculo con ese id',
                errors: { message: 'No existe un vehiculo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            vehiculo: vehiculoBorrado
        });

    });


});


function actualizarDispositivo(id) {
    Dispositivo.findById(id, (err, dispositivoEncontrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar vehiculo',
                errors: err
            });
        }

        if (!dispositivoEncontrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El dispositivo con el id ' + id + ' no existe',
                errors: { message: 'No existe un dispositivo con ese ID' }
            });
        }

        dispositivoEncontrado.disponible = false;

        dispositivoEncontrado.save((err, dispositivoActualizado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar dispositivo',
                    errors: err
                });
            }
            
            console.log('dispositivo actualizado la disponibilidad',dispositivoActualizado);

        });

    }); 
}


module.exports = app;