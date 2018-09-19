var express = require('express');

var app = express();

//nombres rutass de navegacion + el path de la ruta
app.use('/despacho',require('./despacho/index-despacho.route'));
app.use('/estado',require('./estado.route'));
app.use('/role',require('./role.route'));
app.use('/google-map',require('./google-map/index.route.google-map'));
app.use('/vehiculo',require('./vehiculo.route'));
app.use('/nacionalidad', require('./nacionalidad.route'));
app.use('/dispositivo', require('./dispositivo.route'));
app.use('/usuario', require('./usuario'));
app.use('/empresa', require('./empresa'));
app.use('/operario', require('./operario'));
app.use('/login', require('./login'));
app.use('/busqueda', require('./busqueda'));
app.use('/upload', require('./upload'));
app.use('/download', require('./download'));
app.use('/img', require('./imagenes'));
app.use('/', require('./app'));


module.exports=app;