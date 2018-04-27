// Requires
require('./config/server.config');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var socketIO = require('socket.io');
var http = require('http');
var path = require('path');



// Inicializar variables
var app = express();
//var publicPath = path.resolve(__dirname, '../public');


// CORS  mas informacion en: https://enable-cors.org/server_expressjs.html , https://github.com/expressjs/cors 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var empresaRoutes = require('./routes/empresa');
var operarioRoutes = require('./routes/operario');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var deviceRoutes = require('./routes/device');

// Conexión a la base de datos  urlDBlocal
mongoose.connection.openUri(process.env.urlDataBase, (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});


// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));
// app.use(express.static(publicPath));



// Rutas de navegacion
app.use('/device', deviceRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/empresa', empresaRoutes);
app.use('/operario', operarioRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);

var server = http.createServer(app);

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);
require('./sockets/socket');


// Escuchar peticiones
server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);
    console.log(`Servidor en puerto. ${ process.env.PORT }: \x1b[32m%s\x1b[0m`, 'online');
});