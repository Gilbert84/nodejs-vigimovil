var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var asignacionSchema = new Schema({
    fechaHora: { type: Date, required: [true, 'campo requerido'] },
    disponible: { type: Boolean, required: [true, 'campo requerido'] },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', required: true 
    },
    operario:{
        type: Schema.Types.ObjectId, 
        ref: 'Operario', required: true         
    },
    vehiculo:{
        type: Schema.Types.ObjectId,
        ref: 'Vehiculo',
        required: [true, 'El id del vehiculo es un campo obligatorio']
    }
}, { collection: 'Asignaciones' });


module.exports = mongoose.model('Asignacion', asignacionSchema);