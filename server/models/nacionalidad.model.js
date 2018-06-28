var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var nacionaliadSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es necesario'],
        unique: true
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'Nacionalidad' });

nacionaliadSchema.plugin(uniqueValidator, { message: 'el {PATH} debe de ser único' });



module.exports = mongoose.model('Nacionalidad', nacionaliadSchema);