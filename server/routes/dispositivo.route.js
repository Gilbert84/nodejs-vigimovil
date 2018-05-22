var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Dispositivo = require('../models/dispositivo.model');

// ==========================================
// Obtener todos los dipositivos
// ==========================================
app.get('/', (req, res, next) => {

   var desde = req.query.desde || 0;
   desde = Number(desde);


    Dispositivo.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, dispositivos) => {
    
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando dispositivos',
                        errors: err
                    });
                }
    
                Dispositivo.count({}, (err, conteo) => {
    
                    res.status(200).json({
                        ok: true,
                        dispositivos: dispositivos,
                        total: conteo
                    });
    
                })
            });
});



// ==========================================
// Obtener dispositivo
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Dispositivo.findById(id)
        .exec((err, dispositivo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar dispositivo',
                    errors: err
                });
            }

            if (!dispositivo) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El dispositivo con el id ' + id + ' no existe',
                    errors: { message: 'No existe un dispositivo con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                dispositivo: dispositivo
            });

        })


});

// ==========================================
// Actualizar Dispositivo
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    console.log(req.params);

    var id = req.params.id;
    var body = req.body;

    Dispositivo.findById(id, (err, dispositivo) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar dispositivo',
                errors: err
            });
        }

        if (!dispositivo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El dispositivo con el id ' + id + ' no existe',
                errors: { message: 'No existe un dispositivo con ese ID' }
            });
        }


        dispositivo.nombre = body.nombre;
        dispositivo.activo = body.activo;

        dispositivo.save((err, dispositivoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar dispositivo',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                dispositivo: dispositivoGuardado
            });

        });

    });

});

// ============================================
//   Borrar un dispositivo por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Dispositivo.findByIdAndRemove(id, (err, dispositivoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar dispositivo',
                errors: err
            });
        }

        if (!dispositivoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un dispositivo con ese id',
                errors: { message: 'No existe un dispositivo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            operario: dispositivoBorrado
        });

    });
});


module.exports = app;
