var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['USER_ROLE', 'OPERADOR_ROLE','COORDINADOR_ROLE' ,'ADMIN_ROLE' , 'SUPER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


var roleSchema = new Schema({
    role: { type: String, required: true,unique: true, default: 'USER_ROLE', enum: rolesValidos },
});

roleSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Role', usuarioSchema);