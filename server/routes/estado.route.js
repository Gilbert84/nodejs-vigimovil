var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Estado = require('../models/estado.model');
// ==========================================
// Obtener todos los estados
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Estado.find({})
        .skip(desde)
        .limit(5)
        //.populate('usuario', 'nombre email')
        .exec(
            (err, estados) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando estado',
                        errors: err
                    });
                }

                Estado.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        estados: estados,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Estado por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Estado.findById(id)
        //.populate('usuario', 'nombre img email')
        .exec((err, estado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar estado',
                    errors: err
                });
            }

            if (!estado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La estado con el id ' + id + 'no existe',
                    errors: { message: 'No existe una estado con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                estado: estado
            });
        })
})





// ==========================================
// Actualizar Estado
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Estado.findById(id, (err, estado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar estado',
                errors: err
            });
        }

        if (!estado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La estado con el id ' + id + ' no existe',
                errors: { message: 'No existe una estado con ese ID' }
            });
        }


        estado.nombre = body.nombre;
        estado.usuario = req.usuario._id;

        estado.save((err, estadoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar estado',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                estado: estadoGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo estado
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var estado = new Estado({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    estado.save((err, estadoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear estado',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            estado: estadoGuardado
        });


    });

});


// ============================================
//   Borrar un estado por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Estado.findByIdAndRemove(id, (err, estadoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar estado',
                errors: err
            });
        }

        if (!estadoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una estado con ese id',
                errors: { message: 'No existe una estado con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            estado: estadoBorrado
        });

    });

});


module.exports = app;