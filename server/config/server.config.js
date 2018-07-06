//======================================
//  configuracion entorno de trabajo
//======================================

//var defaultEnv = 'casa';
var defaultEnv = 'oficina';

process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv;
process.env.PORT = process.env.PORT || 3000;

//=======================================
//   configuracion base de datos
//=======================================

var urlDB;

if (process.env.NODE_ENV === 'casa') {
    urlDB = 'mongodb://localhost:27017/vigimovilDB';
} else if (process.env.NODE_ENV === 'oficina') {
    urlDB = 'mongodb://root:admin@localhost';
} else {
    urlDB = 'mongodb://admin:VentanaElectr0nica@ds141514.mlab.com:41514/vigimovildb';
}

process.env.urlDataBase = urlDB;
console.log(`Config Entorno : \x1b[32m%s\x1b[0m`, defaultEnv);