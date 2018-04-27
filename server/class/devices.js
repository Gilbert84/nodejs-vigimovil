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



}


module.exports = {
    Dispositivos
}