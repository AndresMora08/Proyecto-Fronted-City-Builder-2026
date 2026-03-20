class Edificio{

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad, x, y) {

        this._nombre = nombre;
        this._tipo = tipo;
        this._costoConstruccion = Number(costoConstruccion);
        this._consumoAgua = Number(consumoAgua);
        this._consumoElectricidad = Number(consumoElectricidad);
        this._x = x;
        this._y = y;

        this._codigoMapa = null;
    }

    // GETTERS

    getNombre(){
        return this._nombre;
    }

    getTipo(){
        return this._tipo;
    }

    getCostoConstruccion(){
        return this._costoConstruccion;
    }

    getConsumoAgua(){
        return this._consumoAgua;
    }

    getConsumoElectricidad(){
        return this._consumoElectricidad;
    }

    getX(){
        return this._x;
    }

    getY(){
        return this._y;
    }

    getCodigoMapa(){
        return this._codigoMapa;
    }

    // SETTERS

    setNombre(nombre){
        this._nombre = nombre;
    }

    setTipo(tipo){
        this._tipo = tipo;
    }

    setCostoConstruccion(costo){
        this._costoConstruccion = costo;
    }

    setConsumoAgua(consumo){
        this._consumoAgua = consumo;
    }

    setConsumoElectricidad(consumo){
        this._consumoElectricidad = consumo;
    }

    setX(x){
        this._x = x;
    }

    setY(y){
        this._y = y;
    }

    setCodigoMapa(codigoMapa){
        this._codigoMapa = codigoMapa;
    }
}
