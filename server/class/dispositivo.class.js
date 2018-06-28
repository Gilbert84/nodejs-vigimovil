var Dispositivo = require('../models/dispositivo.model'); // esquema para grabar directamente en la base de datos 

var crearMensaje = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };

}

class Dispositivos {

    constructor() {
        this.dispositivos = [];
    }

    agregarDispositivo(id, nombre, ruta) {

        var dispositivo = { id, nombre, ruta };

        this.dispositivos.push(dispositivo);
        console.log(dispositivo);

        return this.dispositivos;

    }

    getDispositivo(id) {
        let dispositivo = this.dispositivos.filter(dispositivo => dispositivo.id === id)[0];
        return dispositivo;
    }

    getDispositivos() {
        return this.dispositivos;
    }

    getDispositivoPorRuta(ruta) {
        let dispositivoEnRuta = this.dispositivos.filter(dispositivo => dispositivo.ruta === ruta);
        return dispositivoEnRuta;
    }

    borrarDispositivo(id) {

        let dispositivoBorrado = this.getDispositivo(id);

        this.dispositivo = this.dispositivos.filter(dispositivo => dispositivo.id != id);

        return dispositivoBorrado;

    }

    validarData(device, data) {

        if (!data.nombre || !data.ruta) {
            return callback({
                error: true,
                mensaje: 'El nombre/ruta es necesario'
            });
        }

        device.join(data.ruta);

        this.agregarDispositivo(device.id, data.nombre, data.ruta);

    };


    crearDispositivo(data){


        var uuid = data.uuid;
        var result={};

        return new Promise((resolve,reject)=>{

            Dispositivo.findOne({ uuid })
                .exec((err, dispositivo) => {
    
                    if (err) {
                        console.log('error dispositivo',dispositivo);
                        reject( {
                            ok: false,
                            mensaje: 'Error al buscar dispositivo',
                            errors: err
                    });
                }
    
                if (!dispositivo) {//si no existe lo creamos

                    var nuevoDispositivo = new Dispositivo(data);
                    nuevoDispositivo.save( (err, dispositivoGuardado) => {

        
                        if (err) {
                            reject( {
                                ok: false,
                                server :{
                                    mensaje: 'Error al crear dispositivo',
                                },
                            });
                        }
        
                        resolve({
                            ok: true,
                            server :{
                                mensaje: 'dispositivo registrado',
                                dispositivo: dispositivoGuardado
                            } 
                        });
                
                    });
                }
                //regreso el registro existente de la base de datos
                else{
                    resolve({
                        ok: true,
                        server :{
                            mensaje: 'dispositivo ya se encuentra registrado',
                            dispositivo: dispositivo
                        }
                    });
                }

    
            })

        });
    }


}


module.exports = {
    Dispositivos
}