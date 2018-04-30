var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var empresaSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es necesario'],
        unique: true
    },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'Empresas' });

empresaSchema.plugin(uniqueValidator, { message: 'el {PATH} debe de ser único' });



module.exports = mongoose.model('Empresa', empresaSchema);