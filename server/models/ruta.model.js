var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var rutaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    kml: { type: Array, required: [true, 'El kml es nesesario'] },
    fechaCreado: { type: Date ,required:false , default: new Date()}, 
    fechaActualizado: { type: Date ,required:false}, 
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', required: true 
    }
});


module.exports = mongoose.model('Ruta', rutaSchema);