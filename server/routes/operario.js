var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Operario = require('../models/operario');

// ==========================================
// Obtener todos los operarios
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Operario.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('empresas')
        .exec(
            (err, operarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando operario',
                        errors: err
                    });
                }

                Operario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        operarios: operarios,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener médico
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Operario.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('empresa')
        .exec((err, operario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar operario',
                    errors: err
                });
            }

            if (!operario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El operario con el id ' + id + ' no existe',
                    errors: { message: 'No existe un operario con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                operario: operario
            });

        })


});

// ==========================================
// Actualizar Operario
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Operario.findById(id, (err, operario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar operario',
                errors: err
            });
        }

        if (!operario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El operario con el id ' + id + ' no existe',
                errors: { message: 'No existe un operario con ese ID' }
            });
        }


        operario.nombre = body.nombre;
        operario.usuario = req.usuario._id;
        operario.empresa = body.empresa;

        operario.save((err, operarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar operario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                operario: operarioGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo operario
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var operario = new Operario({
        nombre: body.nombre,
        usuario: req.usuario._id,
        empresa: body.empresa
    });

    operario.save((err, operarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear operario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            operario: operarioGuardado
        });


    });

});


// ============================================
//   Borrar un operario por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Operario.findByIdAndRemove(id, (err, operarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar operario',
                errors: err
            });
        }

        if (!operarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un operario con ese id',
                errors: { message: 'No existe un operario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            operario: operarioBorrado
        });

    });

});


module.exports = app;