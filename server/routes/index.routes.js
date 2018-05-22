var express = require('express');

var app = express();

//nombres rutass de navegacion + el path de la ruta
app.use('/dispositivo', require('./dispositivo.route'));
app.use('/usuario', require('./usuario'));
app.use('/empresa', require('./empresa'));
app.use('/operario', require('./operario'));
app.use('/login', require('./login'));
app.use('/busqueda', require('./busqueda'));
app.use('/upload', require('./upload'));
app.use('/img', require('./imagenes'));
app.use('/', require('./app'));


module.exports=app;