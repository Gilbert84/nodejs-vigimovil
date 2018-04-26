var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var categoriasValidas = {
    values: ['TABLET', 'SMARTPHONE','GPS'],
    message: '{VALUE} no es una categoria permitida'
};

var deviceSchema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  categoria: { type: String, required: true, default: 'TABLET', enum: categoriasValidas }
});


module.export = mongoose.model('Device', deviceSchema);
