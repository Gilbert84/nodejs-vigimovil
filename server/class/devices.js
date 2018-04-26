class Dispositivos {

    constructor() {
        this.dispositivos = [];
    }

    agregarDispositivo(id, nombre, ruta) {

        var dispositivo = { id, nombre, ruta };

        this.dispositivos.push(dispositivo);

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

    dataSocketDev (device,data,callback ){
    console.log('entro el dispositivo:',data);

        console.log('entro el dispositivo:',data);
        if (!device.nombre || !device.ruta) {
            return callback({
                error: true,
                mensaje: 'El nombre/ruta es necesario'
            });
        }

        device.join(device.ruta);

        dispositivos.agregarDispositivo(device.id, device.nombre, device.ruta);

        device.broadcast.to(device.ruta).emit('listaDispositivo', dispositivos.getDispositivoPorRuta(device.ruta));
        device.broadcast.to(device.ruta).emit('crearMensaje', crearMensaje('Administrador', `${ device.nombre } se unió`));

        callback(dispositivos.getDispositivoPorRuta(device.ruta));
    };



}


module.exports = {
    Dispositivos
}