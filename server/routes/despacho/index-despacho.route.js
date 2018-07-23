var express = require('express');

var app = express();

//nombres rutass de navegacion + el path de la ruta
app.use('/asignacion',require('./asignacion.route'));
app.use('/viaje',require('./viaje.route'));

module.exports=app;