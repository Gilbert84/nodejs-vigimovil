//======================================
//  configuracion entorno de trabajo
//======================================//

//var defaultEnv = 'bitnami-server';
var defaultEnv = 'bitnami-server-oficina';
//var defaultEnv = 'mongodb';

process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv;
process.env.PORT = process.env.PORT || 3000;

//=======================================
//   configuracion base de datos
//=======================================

var urlDB;

if (process.env.NODE_ENV === 'mongodb') {
    urlDB = 'mongodb://localhost:27017/vigimovilDB';
} else if (process.env.NODE_ENV === 'bitnami-server') {
    urlDB = 'mongodb://root:12345678@localhost';
}else if (process.env.NODE_ENV === 'bitnami-server-oficina') {
    urlDB = 'mongodb://root:admin@localhost';
} else {
    urlDB = 'mongodb://admin:VentanaElectr0nica@ds141514.mlab.com:41514/vigimovildb';
}

process.env.urlDataBase = urlDB;
console.log(`Config Entorno : \x1b[32m%s\x1b[0m`, defaultEnv);