var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var asignacionSchema = new Schema({
    fechaHora: { type: Date, required: [true, 'campo requerido'] },
    disponible: { type: Boolean, required: [true, 'campo requerido'] },
    fechaCreado: { type: Date, required: false, default: new Date() },
    fechaActualizado: { type: Date, required: false },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
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
    }
}, { collection: 'Asignaciones' });

asignacionSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Asignacion', asignacionSchema);