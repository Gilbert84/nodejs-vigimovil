var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var rutaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    kml: { type: Array, required: [true, 'El kml es nesesario'] },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', required: true 
    }
});


module.exports = mongoose.model('Ruta', rutaSchema);