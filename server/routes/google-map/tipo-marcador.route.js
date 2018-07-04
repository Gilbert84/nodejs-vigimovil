var express = require('express');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var TipoMarcador = require('../../models/google-map/tipo-marcador.model');
// ==========================================
// Obtener todos los tipoMarcadores
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    TipoMarcador.find({})
        .skip(desde)
        .limit(5)
        //.populate('usuario', 'nombre email')
        .exec(
            (err, tipoMarcadores) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando tipoMarcador',
                        errors: err
                    });
                }

                TipoMarcador.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        tipoMarcadores: tipoMarcadores,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener TipoMarcador por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    TipoMarcador.findById(id)
        //.populate('usuario', 'nombre img email')
        .exec((err, tipoMarcador) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar tipoMarcador',
                    errors: err
                });
            }

            if (!tipoMarcador) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La tipoMarcador con el id ' + id + 'no existe',
                    errors: { message: 'No existe una tipoMarcador con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                tipoMarcador: tipoMarcador
            });
        })
})





// ==========================================
// Actualizar TipoMarcador
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    TipoMarcador.findById(id, (err, tipoMarcador) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar tipoMarcador',
                errors: err
            });
        }

        if (!tipoMarcador) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La tipoMarcador con el id ' + id + ' no existe',
                errors: { message: 'No existe una tipoMarcador con ese ID' }
            });
        }


        tipoMarcador.nombre = body.nombre;
        tipoMarcador.usuario = req.usuario._id;
        tipoMarcador.fechaActualizado = new Date();

        tipoMarcador.save((err, tipoMarcadorGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar tipoMarcador',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                tipoMarcador: tipoMarcadorGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo tipoMarcador
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var tipoMarcador = new TipoMarcador({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    tipoMarcador.save((err, tipoMarcadorGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tipoMarcador',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            tipoMarcador: tipoMarcadorGuardado
        });


    });

});


// ============================================
//   Borrar un tipoMarcador por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    TipoMarcador.findByIdAndRemove(id, (err, tipoMarcadorBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar tipoMarcador',
                errors: err
            });
        }

        if (!tipoMarcadorBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una tipoMarcador con ese id',
                errors: { message: 'No existe una tipoMarcador con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            tipoMarcador: tipoMarcadorBorrado
        });

    });

});


module.exports = app;