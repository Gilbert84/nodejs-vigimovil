var express = require('express');

var app = express();

//nombres rutass de navegacion + el path de la ruta
app.use('/tipo-marcador',require('./tipo-marcador.route'));
app.use('/marcador',require('./marcador.route'));
app.use('/ruta',require('./ruta.route'));

module.exports=app;