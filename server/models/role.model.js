var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;



var roleSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es necesario'],
        unique: true
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaCreado: { type: Date ,required:false , default: new Date()}, 
    fechaActualizado: { type: Date ,required:false}, 
}, { collection: 'Roles' });

roleSchema.plugin(uniqueValidator, { message: 'el {PATH} debe de ser único' });

module.exports = mongoose.model('Role', roleSchema);