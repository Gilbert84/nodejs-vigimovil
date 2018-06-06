var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var despachoSchema = new Schema({
    hora: { type: String, required: [true, 'El nombre es necesario'] },
    codigo: { type: String, required: [true, 'El nombre de usuario es necesario'] },
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
});


module.exports = mongoose.model('Despacho', despachoSchema);