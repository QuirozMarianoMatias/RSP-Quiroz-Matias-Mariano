class Persona {
    constructor(id, nombre, apellido, fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }

    toString() {
        return `id: ${this.id}, nombre: ${this.nombre}, apellido: ${this.apellido}, edad: ${this.fechaNacimiento}`;
    }

    toJson() {
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            fechaNacimiento: this.fechaNacimiento
        });
    }

    update(data){
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.fechaNacimiento = Number(data.fechaNacimiento);
    }
}