var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../../config/google.config').SEED;

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();

var Viaje = require('../../models/despacho/viaje.model');


// ==========================================
// Obtener todos los viajes
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Viaje.find({})
        .skip(desde)
        .limit(5)
        .populate('asigancion')
        .populate('ruta')
        .exec(
            (err, viajes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando viaje',
                        errors: err
                    });
                }


                Viaje.populate(viajes,
                    {path:'asigancion.operario',select: 'nombre identificacion',model:'Operario'},
                    (error,viajes)=>{
                        Viaje.count({}, (err, conteo) => {
                            res.status(200).json({
                                ok: true,
                                viajes: viajes,
                                total: conteo
                            });
        
                        });
                });
                

            });
});

// ==========================================
// Obtener viaje
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Viaje.findById(id)
        .populate('asigancion')
        .populate('ruta')
        .exec((err, viaje) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar viaje',
                    errors: err
                });
            }

            if (!viaje) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El viaje con el id ' + id + ' no existe',
                    errors: { message: 'No existe un viaje con ese ID' }
                });
            }

            Viaje.populate(viaje,
                {path:'asigancion.operario',select: 'nombre identificacion',model:'Operario'},
                (error,tipo)=>{
                    res.status(200).json({
                        ok: true,
                        viaje: viaje
                    });
            });

        })


});

// ==========================================
// Actualizar Viaje
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Viaje.findById(id, (err, viaje) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar viaje',
                errors: err
            });
        }

        if (!viaje) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El viaje con el id ' + id + ' no existe',
                errors: { message: 'No existe un viaje con ese ID' }
            });
        }

        viaje.fechaHoraInicio = body.puntosRef;
        viaje.fechaHoraFin = body.puntosControl;
        viaje.pasajeros = body.nombre;
        viaje.estado = body.codigo;
        viaje.usuario = req.usuario._id;
        viaje.ruta = body.origen;

        viaje.save((err, viajeGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar viaje',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                viaje: viajeGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo viaje
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var viaje = new Viaje({
        fechaHoraInicio: new Date(),
        usuario: req.usuario._id,
        ruta: body.ruta,
    });

    viaje.save((err, viajeGuardado) => {

        if (err) {
            console.log('error',err);
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear viaje',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            viaje: viajeGuardado
        });


    });

});


// ============================================
//   Borrar un viaje por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Viaje.findByIdAndRemove(id, (err, viajeBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar viaje',
                errors: err
            });
        }

        if (!viajeBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un viaje con ese id',
                errors: { message: 'No existe un viaje con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            viaje: viajeBorrado
        });

    });


});


module.exports = app;