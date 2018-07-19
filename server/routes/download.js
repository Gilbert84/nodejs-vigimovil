const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');



app.get('/:file(*)',(req, res) => {
    var file = req.params.file;
    var fileLocation = path.resolve( __dirname , `../downloads/${file}`);

    // Si existe el path existe
    if (fs.existsSync(fileLocation)) {
        res.sendFile(fileLocation);                
    }else{
        res.status(200).json({
            ok: false,
            mensaje: 'no existe un archivo con ese nombre para descargar',
            archivo:file
        });
    }


});

module.exports = app;