var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


var vehiculoSchema = new Schema({

    placa: { type: String,unique: true, required: [true, 'la placa es necesaria'] },
    interno: { type: String,unique: true, required: [true, 'el codigo interno es necesario'] },
    modelo: { type: String, required: [true, 'El nombre de usuario es necesario'] },
    categoria: { type: String, required: [true, 'Campo requerido'] },
    capacidad: { type: String, required: [true, 'Campo requerido'] },
    disponible: { type: Boolean, required: [false, 'Campo requerido'] ,default: true},
    img: { type: String, required: false },
    fechaCreado: { type: Date ,required:false , default: new Date()}, 
    fechaActualizado: { type: Date ,required:false}, 
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', required: true ,
        required: [true, 'El id del usuario es un campo obligatorio ']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'El id de la empresa es un campo obligatorio ']
    },
    dispositivo:{
        type: Schema.Types.ObjectId,
        ref:'Dispositivo',
        required: [true, 'El id del dispositivo es un campo obligatorio'],
        unique: true
    }
});

vehiculoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('Vehiculo', vehiculoSchema );