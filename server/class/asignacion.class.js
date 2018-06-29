

class Asignaciones {


    constructor () {
        this.asignaciones = [];
    }

    actualizar(asignaciones) {
        return this.asignaciones = asignaciones;
    }

    obtener() {
        return this.asignaciones;
    }

    filtrar(){
        return this.asignaciones = this.asignaciones.filter( asignacion =>{
            return asignacion.disponible != false;
        });        
    }

}


module.exports = {
    Asignaciones
}