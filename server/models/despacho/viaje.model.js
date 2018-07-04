var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var viajeSchema = new Schema({
    fechaHoraInicio: { type: Date, required: [false, 'El nombre es necesario'] },
    fechaHoraFin: { type: Date, required: [false, 'El nombre es necesario'] },
    pasajeros:{ type: Object, required: false},
    estado: { type: Object, required: false, default: { mensaje:'disponible' , codigo: 1 } },
    fechaCreado: { type: Date ,required:false , default: new Date()}, 
    fechaActualizado: { type: Date ,required:false}, 
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', required: true 
    },
    asignacion:{
        type: Schema.Types.ObjectId,
        ref: 'Asignacion',
        required: [true, 'El id de la asignacion es requerido']
    },
    ruta:{
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
        required: [true, 'El id de la Ruta es requerido']
    }
});


module.exports = mongoose.model('Despacho', viajeSchema);