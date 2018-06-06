var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

var Usuario = require('../models/usuario');
var Operario = require('../models/operario');
var Empresa = require('../models/empresa');


// default options
app.use(fileUpload());



//https://www.npmjs.com/package/vcards-js
//https://github.com/alexeyten/qr-image
var qr = require('qr-image');
app.get('/qr',(req,res,next)=>{

    var vCard = require('vcards-js');
    //create a new vCard
    vCard = vCard();
 
    //set properties
    vCard.firstName = 'Gilberto';
    vCard.lastName = 'Hernandez';
    vCard.organization = 'BellanitaGroup';
    vCard.uid = '69531f4a-c34d-4a1e-8922-bd38a9476a53';
    vCard.role = 'electronico';
    vCard.cellPhone = '312-429-9062';
    vCard.version = '4.0';
 
    //set content-type and disposition including desired filename
    //res.set('Content-Type', 'text/vcard; name="enesser.vcf"');
    //res.set('Content-Disposition', 'inline; filename="enesser.vcf"');
 
    //send the response
    //res.send(vCard.getFormattedString());
    

    var midato='tipo:cualquier cosa,token:qhquahhuahus';

    var code = qr.image( midato , { type: 'png',size: 10, ec_level: 'L'});
    res.setHeader('Content-type', 'image/png');  //sent qr image to client side
    code.pipe(res);
    //console.log(vCard.getFormattedString());


});





app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colección
    var tiposValidos = ['empresas', 'operarios', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;


    // Mover el archivo del temporal a un path
    var path = `./server/uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }


        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });


    })



});



function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }


            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            })


        });

    }

    if (tipo === 'operarios') {

        Operario.findById(id, (err, operario) => {

            if (!operario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Operario no existe',
                    errors: { message: 'Operario no existe' }
                });
            }

            var pathViejo = './uploads/operarios/' + operario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            operario.img = nombreArchivo;

            operario.save((err, operarioActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de operario actualizada',
                    operario: operarioActualizado
                });

            })

        });
    }

    if (tipo === 'empresas') {

        Empresa.findById(id, (err, empresa) => {

            if (!empresa) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Empresa no existe',
                    errors: { message: 'Empresa no existe' }
                });
            }

            var pathViejo = './uploads/empresas/' + empresa.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            empresa.img = nombreArchivo;

            empresa.save((err, empresaActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de empresa actualizada',
                    empresa: empresaActualizado
                });

            })

        });
    }


}



module.exports = app;