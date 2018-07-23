class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, personaConectada, ruta) {

        let persona = { id, usuario: personaConectada, ruta };
        this.personas.push(persona);

        return this.personas;

    }

    obtenerPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0];

        return persona;
    }

    obtenerPersonas() {
        return this.personas;
    }

    obtenerPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }

    borrarPersona(id) {

        let personaBorrada = this.obtenerPersona(id);

        if (personaBorrada != undefined) {

            this.personas = this.personas.filter(persona => persona.id != id);
        }

        return personaBorrada;

    }

    agregarPersonaPorRole(id, persona) {
        switch (persona.role) {
            case 'ADMIN_ROLE':
                let personas = this.agregarPersona(id, persona, null);
                return personas;
            default:
                return;
        }
    }


}


module.exports = {
    Usuarios
}