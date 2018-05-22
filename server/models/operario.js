var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var operarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    alias: { type: String, required: [true, 'El nombre de usuario es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'El id de la empresa es un campo obligatorio ']
    }
});


module.exports = mongoose.model('Operario', operarioSchema);