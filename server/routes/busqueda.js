var express = require('express');

var app = express();

var Empresa = require('../models/empresa');
var Operario = require('../models/operario');
var Usuario = require('../models/usuario');
var Dispositivo = require('../models/dispositivo.model');
var Vehiculo = require('../models/vehiculo.model');
var Ruta = require('../models/google-map/ruta.model');

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
        case 'dispositivos':
            promesa = buscarDispositivos(busqueda, regex);
            break;
        case 'vehiculos':
            promesa = buscarVehiculos(busqueda, regex);
            break;
        case 'rutas':
            promesa = buscarRutas(busqueda, regex);
        break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, operarios, vehiculos,rutas,dispositivos y empresas',
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
            buscarUsuarios(busqueda, regex),
            buscarDispositivos(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                empresas: respuestas[0],
                operarios: respuestas[1],
                usuarios: respuestas[2],
                dispositivos: respuestas[3]
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
                    resolve(empresas);
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
                    resolve(operarios);
                }
            });
    });
}

function buscarDispositivos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Dispositivo.find({}, 'nombre uuid')
            .or([{ 'nombre': regex }, { 'uuid': regex }])
            .exec((err, dispositivos) => {

                if (err) {
                    reject('Error al cargar dispositivos', err);
                } else {
                    resolve(dispositivos);
                }


            })


    });
}



function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}


function buscarVehiculos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Vehiculo.find({}, 'placa interno')
            .or([{ 'placa': regex }, { 'interno': regex }])
            .exec((err, vehiculos) => {

                if (err) {
                    reject('Error al cargar vehiculos', err);
                } else {
                    resolve(vehiculos);
                }


            })


    });
}


function buscarRutas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Ruta.find({}, 'nombre codigo')
            .or([{ 'nombre': regex }, { 'codigo': regex }])
            .populate('origen')
            .populate('destino')
            .exec((err, rutas) => {

                if (err) {
                    reject('Error al cargar rutas', err);
                } else {
                    Ruta.populate(rutas,
                        {path:'origen.tipo destino.tipo',select: 'nombre img',model:'TipoMarcador'},
                        (error,rutas)=>{
                            if (error){
                                reject('Error al buscar rutas', error);
                            }else{
 
                                resolve(rutas);
                            } 

                    });
                }

            })

    });
}


module.exports = app;