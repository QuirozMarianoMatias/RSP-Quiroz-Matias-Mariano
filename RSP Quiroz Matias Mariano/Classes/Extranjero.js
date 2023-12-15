class Extranjero extends Persona {
  constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
      super(id, nombre, apellido, fechaNacimiento);
      this.paisOrigen = paisOrigen;
  }
  
  toString() {
      return (
      super.toString() +
      `, titulo: ${this.paisOrigen}`
      );
  }

  toJson() {
      const personaJson = super.toJson();
      const extranjeroJson = JSON.stringify({
        paisOrigen: this.paisOrigen,
      
      });
      return Object.assign(JSON.parse(personaJson), JSON.parse(extranjeroJson));
  }
  
  update(data){
      super.update(data);
      this.paisOrigen = data.paisOrigen;
  }
}