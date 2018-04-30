var express = require('express');

var app = express();

var Empresa = require('../models/empresa');
var Operario = require('../models/operario');
var Usuario = require('../models/usuario');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'operarios':
            promesa = buscarOperarios(busqueda, regex);
            break;

        case 'empresas':
            promesa = buscarEmpresas(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, operarios y empresas',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarEmpresas(busqueda, regex),
            buscarOperarios(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                empresas: respuestas[0],
                operarios: respuestas[1],
                usuarios: respuestas[2]
            });
        })


});


function buscarEmpresas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Empresa.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, empresas) => {

                if (err) {
                    reject('Error al cargar empresas', err);
                } else {
                    resolve(empresas)
                }
            });
    });
}

function buscarOperarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Operario.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('empresa')
            .exec((err, operarios) => {

                if (err) {
                    reject('Error al cargar operarios', err);
                } else {
                    resolve(operarios)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}



module.exports = app;