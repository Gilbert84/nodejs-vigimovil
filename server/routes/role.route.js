var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Role = require('../models/role.model');

// ==========================================
// Obtener todos los roles
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Role.find({}, 'role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, roles) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando roles',
                        errors: err
                    });
                }

                Role.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });

                })




            });
});


// ==========================================
// Actualizar usuario
// ==========================================
// app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_o_MismoUsuario], (req, res) => {

//     var id = req.params.id;
//     var body = req.body;

//     Role.findById(id, (err, role) => {


//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al buscar role',
//                 errors: err
//             });
//         }

//         if (!role) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'El usuario con el id ' + id + ' no existe',
//                 errors: { message: 'No existe un usuario con ese ID' }
//             });
//         }


//         role.role = body.role;

//         role.save((err, roleGuardado) => {

//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'Error al actualizar usuario',
//                     errors: err
//                 });
//             }

//             usuarioGuardado.password = ':)';

//             res.status(200).json({
//                 ok: true,
//                 usuario: usuarioGuardado
//             });

//         });

//     });

// });



// // ==========================================
// // Crear un nuevo usuario
// // ==========================================
// app.post('/', (req, res) => {

//     var body = req.body;

//     var usuario = new Usuario({
//         nombre: body.nombre,
//         email: body.email,
//         password: bcrypt.hashSync(body.password, 10),
//         img: body.img,
//         role: body.role
//     });

//     usuario.save((err, usuarioGuardado) => {

//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'Error al crear usuario',
//                 errors: err
//             });
//         }

//         res.status(201).json({
//             ok: true,
//             usuario: usuarioGuardado,
//             usuariotoken: req.usuario
//         });


//     });

// });


// // ============================================
// //   Borrar un usuario por el id
// // ============================================
// app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (req, res) => {

//     var id = req.params.id;

//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error borrar usuario',
//                 errors: err
//             });
//         }

//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'No existe un usuario con ese id',
//                 errors: { message: 'No existe un usuario con ese id' }
//             });
//         }

//         res.status(200).json({
//             ok: true,
//             usuario: usuarioBorrado
//         });

//     });

//});


module.exports = app;
