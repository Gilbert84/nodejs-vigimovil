var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var viajeSchema = new Schema({
    fechaHoraInicio: { type: Date, required: [true, 'El nombre es necesario'] },
    fechaHoraFin: { type: Date, required: [false, 'El nombre es necesario'] },
    pasajeros:{ type: Object, required: false},
    estado: { type: Object, required: true, default: { mensaje:'disponible' , codigo: 1 } },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', required: true 
    },
    asigancion:{
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