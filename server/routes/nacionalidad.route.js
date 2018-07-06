var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Nacionalidad = require('../models/nacionalidad.model');

// ==========================================
// Obtener todos los nacionalidades
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Nacionalidad.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, nacionalidades) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando nacionalidad',
                        errors: err
                    });
                }

                Nacionalidad.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        nacionalidades: nacionalidades,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Nacionalidad por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Nacionalidad.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, nacionalidad) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar nacionalidad',
                    errors: err
                });
            }

            if (!nacionalidad) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La nacionalidad con el id ' + id + 'no existe',
                    errors: { message: 'No existe una nacionalidad con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                nacionalidad: nacionalidad
            });
        })
})





// ==========================================
// Actualizar Nacionalidad
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Nacionalidad.findById(id, (err, nacionalidad) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar nacionalidad',
                errors: err
            });
        }

        if (!nacionalidad) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La nacionalidad con el id ' + id + ' no existe',
                errors: { message: 'No existe una nacionalidad con ese ID' }
            });
        }


        nacionalidad.nombre = body.nombre;
        nacionalidad.usuario = req.usuario._id;
        nacionalidad.fechaActualizado = new Date();
        

        nacionalidad.save((err, nacionalidadGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar nacionalidad',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                nacionalidad: nacionalidadGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo nacionalidad
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var nacionalidad = new Nacionalidad({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    nacionalidad.save((err, nacionalidadGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear nacionalidad',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            nacionalidad: nacionalidadGuardado
        });


    });

});


// ============================================
//   Borrar un nacionalidad por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Nacionalidad.findByIdAndRemove(id, (err, nacionalidadBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar nacionalidad',
                errors: err
            });
        }

        if (!nacionalidadBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una nacionalidad con ese id',
                errors: { message: 'No existe una nacionalidad con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            nacionalidad: nacionalidadBorrado
        });

    });

});


module.exports = app;