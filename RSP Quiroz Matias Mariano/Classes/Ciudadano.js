class Ciudadano extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento,dni) {
    super(id, nombre, apellido, fechaNacimiento);
    this.dni = dni;
    
    }

    toString() {
    return (
        super.toString() + `, dni: ${this.dni}`
    );
    }

    toJson() {
    const personaJson = super.toJson();
    const ciudadanoJson = JSON.stringify({
        dni: this.dni,
    });
    return Object.assign(JSON.parse(personaJson), JSON.parse(ciudadanoJson));
    }

    update(data){
    super.update(data);
    this.dni = Number(data.dni);
    }
}