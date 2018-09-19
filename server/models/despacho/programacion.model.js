var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var programacionSchema = new Schema({
    fechaHora: { type: Date, required: [true, 'parametro requerido'] },
    tarjetaOperacion:{type: Number, required:[true,'parametro requerido']},
    fechaCreado: { type: Date, required: false, default: new Date() },
    fechaActualizado: { type: Date, required: false },
    operario: {
        type: Schema.Types.ObjectId,
        ref: 'Operario',
        required: true,
        unique: true
    },
    vehiculo: {
        type: Schema.Types.ObjectId,
        ref: 'Vehiculo',
        required: [true, 'El id del vehiculo es un campo obligatorio'],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, { collection: 'Programaciones' });


module.exports = mongoose.model('Despacho', programacionSchema);