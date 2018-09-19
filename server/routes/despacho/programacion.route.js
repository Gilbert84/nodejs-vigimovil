var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../../middlewares/autenticacion');

var app = express();


// ==========================================
// Obtener todas las programaciones
// ==========================================
app.get('/',(req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

app.get('/programaciones',(req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

app.get('/programacion/:id',(req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

// ==========================================
// Obtener programacion
// ==========================================
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});


// ==========================================
// Crear una nueva programacion
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

// ==========================================
// Insertar una nueva programacion
// ==========================================
app.post('/programacionesSatBellanita', [mdAutenticacion.verificaToken, mdAutenticacion.verificaSERVER_ROLE], (req, res) => {



    res.status(200).json({
        ok: true,
        mensaje: 'token correcto'
    });
});


// ==========================================
// Actualizar programacion
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});


app.put('/programacionesSatBellanita/:id', mdAutenticacion.verificaToken, (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});


// ============================================
//   Borrar programacion por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});


module.exports = app;