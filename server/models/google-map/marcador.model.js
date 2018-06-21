var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var marcadorSchema = new Schema({

    lat: { type: Number,unique: true, required: [true, 'la latitud es necesaria'] },
    lng: { type: Number,unique: true, required: [true, 'la longitud es necesaria'] },
    direccion: { type: String,unique: true, required: [true, 'la direccion es necesaria'] },
    codigo: { type: String,unique: true, required: [true, 'el codigo es necesario'] },
    arrastable: { type: Boolean, required: [true, 'el estado arrastable es nesesario'] },
    nombre: { type: String, unique: true,required: [true, 'Campo requerido'] },
    descripcion: { type: String, required: [false, 'Campo opcional'] },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', required: true ,
        required: [true, 'El id del usuario es un campo obligatorio ']
    },
    tipo: {
        type: Schema.Types.ObjectId,
        ref: 'TipoMarcador',
        required: [true, 'El id del tipo es un campo obligatorio ']
    }
},{ collection: 'Marcadores' });


module.exports = mongoose.model('Marcador', marcadorSchema );