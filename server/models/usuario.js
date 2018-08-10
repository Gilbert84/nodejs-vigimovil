var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

//jerarquia menu de nive 0 hasta rol de desarrollador
// la posicion 0 del arreglo es para USER_ROLE TIPOS DE ROLES PENDIENTES : Cohesionador ,Monitor 

/*
Administrador educativo
Administrativo de oficina
Administrativo de planificación de personal
Administrativo de programación de trasnporte
Administrativo publicitario
Cartógrafo
Director del departamento de marketing
Encargado del compras de compras
Encargado del departamento de ventas
Gerente de producción u operaciones
Gerente del departamento de finanzas
Gerente del departamento de personal
Gerente del departamento de publicidad
Gerente del departamento de relaciones públicas
Técnico informático de soporte técnico
*/

var rolesValidos = {
    values: ['ADMINISTRADOR','COORDINADOR', 'DESPACHADOR' , 'SUPERVISOR', 'USUARIO'],
    message: '{VALUE} no es un rol permitido'
};


var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USUARIO', enum: rolesValidos },
    google: { type: Boolean, required: true, default: false },
    fechaCreado: { type: Date ,required:false , default: new Date()}, 
    fechaActualizado: { type: Date ,required:false}, 
});

//usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);