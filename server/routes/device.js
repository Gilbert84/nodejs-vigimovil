var express = require('express');

var app = express();

var Device = require('../models/device');

// ==========================================
// Obtener todos los dipositivos
// ==========================================
app.get('/', (req, res, next) => {

   var desde = req.query.desde || 0;
   desde = Number(desde);

  res.status(200).json({
      ok: true,
      mensaje: desde
  });

    // Device.find({}, 'nombre categoria')
    //     .skip(desde)
    //     .limit(5)
    //     .exec(
    //         (err, dispositivos) => {
    //
    //             if (err) {
    //                 return res.status(500).json({
    //                     ok: false,
    //                     mensaje: 'Error cargando dispositivos',
    //                     errors: err
    //                 });
    //             }
    //
    //             Device.count({}, (err, conteo) => {
    //
    //                 res.status(200).json({
    //                     ok: true,
    //                     dispositivos: dispoitivos,
    //                     total: conteo
    //                 });
    //
    //             })
    //
    //
    //
    //
    //         });
});


module.exports = app;
