var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var categoriasValidas = {
    values: ['TABLET', 'SMARTPHONE', 'GPS'],
    message: '{VALUE} no es una categoria permitida'
};


var dispositivoSchema = new Schema({
    socket_id: { type: String, required: true },
    geoposicion: { type: Object, required: false },
    ruta: { type: String, required: false },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    uuid: { type: String, unique: true, required: [true, 'EL identificador es nesesario'] },
    mac: { type: String, required: false },
    imei: { type: String, required: false },
    imsi: { type: String, required: false },
    iccid: { type: String, required: false },
    img: { type: String, required: false },
    activo: { type: Boolean, required: false },
    disponible: { type: Boolean, required: false },
    simcard1: { type: String, required: false },
    simcard2: { type: String, required: false },
    categoria: { type: String, required: true, default: 'TABLET', enum: categoriasValidas },
    fechaCreado: { type: Date, required: false, default: new Date() },
    fechaActualizado: { type: Date, required: false, default: new Date() }
});

dispositivoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Dispositivo', dispositivoSchema);