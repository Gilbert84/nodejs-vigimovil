var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var rutaSchema = new Schema({

    puntosRef: { type: Array, required: [false, 'El nombre de usuario es necesario'] },
    puntosControl: { type: Array, required: [false, 'Campo requerido'] },
    pasos: { type: Array, required: [false, 'Campo requerido'] },
    nombre: { type: String, required: [true, 'Campo requerido'] },
    codigo: { type: String, required: false },
    visible:{ type: Boolean, required: true },
    distancia:{ type: Object , required: true},
    duraccion:{ type: Object , required: false},
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', required: true ,
        required: [true, 'El id del usuario es un campo obligatorio ']
    },
    origen: {
        type: Schema.Types.ObjectId,
        ref: 'Marcador',
        required: [true, 'El id del origen es un campo obligatorio ']
    },
    destino:{
        type: Schema.Types.ObjectId,
        ref:'Marcador',
        required: [true, 'El id del destino es un campo obligatorio']
    }
});


module.exports = mongoose.model('Ruta', rutaSchema );