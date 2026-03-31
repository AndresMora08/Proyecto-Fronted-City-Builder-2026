class Edificio{

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad, x, y) {

        this.nombre = nombre;
        this.tipo = tipo;
        this.costoConstruccion = Number(costoConstruccion);
        this.consumoAgua = Number(consumoAgua);
        this.consumoElectricidad = Number(consumoElectricidad);
        this.x = x;
        this.y = y;

        this.codigoMapa = null;
    }

    // GETTERS

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

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getCodigoMapa(){
        return this.codigoMapa;
    }

    // SETTERS

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

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }

    setCodigoMapa(codigoMapa){
        this.codigoMapa = codigoMapa;
    }
}
