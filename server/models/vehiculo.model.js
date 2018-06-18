var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var vehiculoSchema = new Schema({

    placa: { type: String,unique: true, required: [true, 'la placa es necesaria'] },
    interno: { type: String,unique: true, required: [true, 'el codigo interno es necesario'] },
    modelo: { type: String, required: [true, 'El nombre de usuario es necesario'] },
    categoria: { type: String, required: [true, 'Campo requerido'] },
    capacidad: { type: String, required: [true, 'Campo requerido'] },
    img: { type: String, required: false },
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
        required: [true, 'El id del dispositivo es un campo obligatorio']
    }
});


module.exports = mongoose.model('Vehiculo', vehiculoSchema );