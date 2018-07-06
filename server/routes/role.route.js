var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Role = require('../models/role.model');
// ==========================================
// Obtener todos los roles
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Role.find({})
        .skip(desde)
        .limit(5)
        //.populate('usuario', 'nombre email')
        .exec(
            (err, roles) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando role',
                        errors: err
                    });
                }

                Role.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        roles: roles,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Role por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Role.findById(id)
        //.populate('usuario', 'nombre img email')
        .exec((err, role) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar role',
                    errors: err
                });
            }

            if (!role) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La role con el id ' + id + 'no existe',
                    errors: { message: 'No existe una role con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                role: role
            });
        })
})





// ==========================================
// Actualizar Role
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Role.findById(id, (err, role) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar role',
                errors: err
            });
        }

        if (!role) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La role con el id ' + id + ' no existe',
                errors: { message: 'No existe una role con ese ID' }
            });
        }


        role.nombre = body.nombre;
        role.usuario = req.usuario._id;
        role.fechaActualizado = new Date();

        role.save((err, roleGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar role',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                role: roleGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo role
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var role = new Role({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    role.save((err, roleGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear role',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            role: roleGuardado
        });


    });

});


// ============================================
//   Borrar un role por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Role.findByIdAndRemove(id, (err, roleBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar role',
                errors: err
            });
        }

        if (!roleBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una role con ese id',
                errors: { message: 'No existe una role con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            role: roleBorrado
        });

    });

});


module.exports = app;