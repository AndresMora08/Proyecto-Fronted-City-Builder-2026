class Ciudad{

    constructor(nombreCiudad, dinero=50000, electricidad=0, agua=0, alimento=0, poblacion=0, puntuacion=0){
    this.nombreCiudad = nombreCiudad;
    this.dinero = dinero;
    this.electricidad = electricidad;
    this.agua = agua;
    this.alimento = alimento;
    this.poblacion = poblacion;
    this.puntuacion = puntuacion;

    this.ciudadanos=[];
    this.edificios=[];
    this.mapa=null;
    }
 get nombreCiudad(){
        return this._nombreCiudad;
    }

    set nombreCiudad(valor){
        this._nombreCiudad = valor;
    }

    get dinero(){
        return this._dinero;
    }

    set dinero(valor){
        this._dinero = valor;
    }

    get electricidad(){
        return this._electricidad;
    }

    set electricidad(valor){
        this._electricidad = valor;
    }

    get agua(){
        return this._agua;
    }

    set agua(valor){
        this._agua = valor;
    }

    get alimento(){
        return this._alimento;
    }

    set alimento(valor){
        this._alimento = valor;
    }

    get poblacion(){
        return this._poblacion;
    }

    set poblacion(valor){
        this._poblacion = valor;
    }

    get puntuacion(){
        return this._puntuacion;
    }

    set puntuacion(valor){
        this._puntuacion = valor;
    }

    get ciudadanos(){
        return this._ciudadanos;
    }

    set ciudadanos(valor){
        this._ciudadanos = valor;
    }

    get edificios(){
        return this._edificios;
    }

    set edificios(valor){
        this._edificios = valor;
    }

    get mapa(){
        return this._mapa;
    }

    set mapa(valor){
        this._mapa = valor;
    }


}
