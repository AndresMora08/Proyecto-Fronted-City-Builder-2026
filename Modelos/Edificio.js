class Edificio{

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad) {

    this.nombre = nombre;
    this.tipo = tipo;
    this.costoConstruccion = costoConstruccion;
    this.consumoAgua = consumoAgua;
    this.consumoElectricidad = consumoElectricidad;

    }
     getNombre(){
        return this.nombre;
    }

    getTipo(){
        return this.tipo;
    }

    getCostoConstruccion(){
        return this.costoConstruccion;
    }

    getConsumoAgua(){
        return this.consumoAgua;
    }

    getConsumoElectricidad(){
        return this.consumoElectricidad;
    }

    

    setNombre(nombre){
        this.nombre = nombre;
    }

    setTipo(tipo){
        this.tipo = tipo;
    }

    setCostoConstruccion(costo){
        this.costoConstruccion = costo;
    }

    setConsumoAgua(consumo){
        this.consumoAgua = consumo;
    }

    setConsumoElectricidad(consumo){
        this.consumoElectricidad = consumo;
    }


}