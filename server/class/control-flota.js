const fs = require('fs');

class Despacho {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }

}

class ControlFlota {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.despachos = [];
        this.ultimosNdespachos = [];

        let data = require('../data/control-flota.data.json');

        //console.log(data);

        if (data.hoy === this.hoy) {
            //continuamos con el trabajo
            this.ultimo = data.ultimo;
            this.despachos = data.despachos;
            this.ultimosNdespachos = data.ultimosNdespachos;
        } else {
            //se reinicia todo
            this.reiniciarConteo();
        }
    }

    reiniciarConteo() {
        this.ultimo = 0;
        this.despachos = [];
        this.ultimosNdespachos = [];
        this.grabarArchivo();
        //console.log('reinciando tareas');
    }


    siguienteDespacho() {
        //actualizo  y regreso el nuevo despacho
        this.ultimo += 1;
        let despacho = new Despacho(this.ultimo, null);
        this.despachos.push(despacho);
        this.grabarArchivo();
        return `Despacho ${ this.ultimo }`;
    }

    obtenerUltimoDespacho() {
        return `Despacho ${ this.ultimo }`;
    }

    atenderDespacho(escritorio) {

        if (this.despachos.length === 0) {
            return {
                ok: false,
                mensaje: 'no hay despachos'
            }
        }

        let numeroDespacho = this.despachos[0].numero; //rompo la relacion por referencia de js
        this.despachos.shift(); //elimino la primera posicion del arreglo
        let atenderDespacho = new Despacho(numeroDespacho, escritorio);
        this.ultimosNdespachos.unshift(atenderDespacho); // lo agrega al inicio del arreglo

        if (this.ultimosNdespachos > 4) {
            this.ultimosNdespachos.splice(-1, 1); //remueve el ultimo elemento de un arreglo
        }

        //console.log('ultimosNdespachos:', this.ultimosNdespachos );

        this.grabarArchivo();

        return atenderDespacho;
    }

    grabarArchivo() {
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            despachos: this.despachos,
            ultimosNdespachos: this.ultimosNdespachos
        }
        let jsonDataSttring = JSON.stringify(jsonData);
        fs.writeFileSync('./server/data/control-flota.data.json', jsonDataSttring);
    }


}


module.exports = {
    ControlFlota
}