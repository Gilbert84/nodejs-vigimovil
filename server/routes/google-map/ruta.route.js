var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../../config/google.config').SEED;

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var Ruta = require('../../models/google-map/ruta.model');


// ==========================================
// Obtener todos los rutas
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Ruta.find({})
        .skip(desde)
        .limit(5)
        .populate('origen')
        .populate('destino')
        .exec(
            (err, rutas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando ruta',
                        errors: err
                    });
                }


                Ruta.populate(rutas,
                    {path:'origen.tipo destino.tipo',select: 'nombre img',model:'TipoMarcador'},
                    (error,rutas)=>{
                        Ruta.count({}, (err, conteo) => {
                            res.status(200).json({
                                ok: true,
                                rutas: rutas,
                                total: conteo
                            });
        
                        });
                });
                

            });
});

// ==========================================
// Obtener ruta
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Ruta.findById(id)
        .populate('origen')
        .populate('destino')
        .exec((err, ruta) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar ruta',
                    errors: err
                });
            }

            if (!ruta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El ruta con el id ' + id + ' no existe',
                    errors: { message: 'No existe un ruta con ese ID' }
                });
            }

            Ruta.populate(ruta,
                {path:'origen.tipo destino.tipo',select: 'nombre img',model:'TipoMarcador'},
                (error,tipo)=>{
                    res.status(200).json({
                        ok: true,
                        ruta: ruta
                    });
            });

        })


});

// ==========================================
// Actualizar Ruta
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Ruta.findById(id, (err, ruta) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ruta',
                errors: err
            });
        }

        if (!ruta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ruta con el id ' + id + ' no existe',
                errors: { message: 'No existe un ruta con ese ID' }
            });
        }

        ruta.puntosRef = body.puntosRef;
        ruta.puntosControl = body.puntosControl;
        ruta.nombre = body.nombre;
        ruta.codigo = body.codigo;
        ruta.usuario = req.usuario._id;
        ruta.origen = body.origen;
        ruta.destino = body.destino;
        ruta.visible = body.visible;

        ruta.save((err, rutaGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar ruta',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                ruta: rutaGuardada
            });

        });

    });

});



// ==========================================
// Crear un nuevo ruta
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var ruta = new Ruta({
        puntosRef: body.puntosRef,
        puntosControl:body.puntosControl,
        nombre:body.nombre,
        codigo:body.codigo,
        usuario: req.usuario._id,
        origen: body.origen,
        destino: body.destino,
        visible: body.visible,
        distancia: body.distancia,
        duraccion: body.duraccion,
        pasos: body.pasos
    });

    ruta.save((err, rutaGuardada) => {

        if (err) {
            console.log('error',err);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear ruta',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            ruta: rutaGuardada
        });


    });

});


// ============================================
//   Borrar un ruta por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Ruta.findByIdAndRemove(id, (err, rutaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar ruta',
                errors: err
            });
        }

        if (!rutaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un ruta con ese id',
                errors: { message: 'No existe un ruta con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            ruta: rutaBorrada
        });

    });


});


module.exports = app;