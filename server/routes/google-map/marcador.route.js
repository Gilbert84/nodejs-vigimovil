var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var Marcador = require('../../models/google-map/marcador.model');
// ==========================================
// Obtener todos los marcadores
// ==========================================
app.get('/', (req, res, next) => {

    Marcador.find({})
        .populate('tipo', 'nombre img')
        .exec(
            (err, marcadores) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando marcador',
                        errors: err
                    });
                }

                Marcador.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        marcadores: marcadores,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener marcador por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Marcador.findById(id)
        .populate('tipo', 'nombre img')
        .exec((err, marcador) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar marcador',
                    errors: err
                });
            }

            if (!marcador) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El marcador con el id ' + id + 'no existe',
                    errors: { message: 'No existe un marcador con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                marcador: marcador
            });
        })
})





// ==========================================
// Actualizar marcador
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Marcador.findById(id, (err, marcador) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar marcador',
                errors: err
            });
        }

        if (!marcador) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El marcador con el id ' + id + ' no existe',
                errors: { message: 'No existe un marcador con ese ID' }
            });
        }

        marcador.nombre = body.nombre;
        marcador.lat = body.lat;
        marcador.lng = body.lng;
        marcador.direccion = body.direccion;
        marcador.descripcion = body.descripcion;
        marcador.tipo = body.tipo._id;
        marcador.arrastable = body.arrastable;
        marcador.usuario = req.usuario._id;

        marcador.save((err, marcadorGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar marcador',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                marcador: marcadorGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo marcador
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var marcador = new Marcador({
        lat:body.lat,
        lng:body.lng,
        direccion:body.direccion,
        codigo:body.codigo,
        arrastable:body.arrastable,
        descripcion:body.descripcion,
        nombre: body.nombre,
        tipo:body.tipo,
        usuario: req.usuario._id
    });

    marcador.save((err, marcadorGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear marcador',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            marcador: marcadorGuardado
        });


    });

});


// ============================================
//   Borrar un marcador por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Marcador.findByIdAndRemove(id, (err, marcadorBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar marcador',
                errors: err
            });
        }

        if (!marcadorBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un marcador con ese id',
                errors: { message: 'No existe un marcador con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            marcador: marcadorBorrado
        });

    });

});


module.exports = app;