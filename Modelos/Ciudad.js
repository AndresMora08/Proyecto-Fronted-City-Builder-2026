class Ciudad{

    constructor(nombreCiudad, latitud, longitud, dinero=50000, electricidad=0, agua=0, alimento=0, poblacion=0, puntuacion=0, region=""){

        this._nombreCiudad = nombreCiudad;
        this._latitud = latitud; 
        this._longitud = longitud;
        this._region = region;

        this._dinero = Number(dinero);
        this._electricidad = Number(electricidad);
        this._agua = Number(agua);
        this._alimento = Number(alimento);
        this._poblacion = Number(poblacion);
        this._puntuacion = Number(puntuacion);

        // Propiedades iniciales
        this._ciudadanos = [];
        this._edificios = [];
        this._mapa = null;
    }
    get nombreCiudad(){
        return this._nombreCiudad;
    }
    get latitud(){ 
        return this._latitud; 
    }

    set latitud(v){
         this._latitud = v; 
    }
    
    get longitud() { 
        return this._longitud; 
    }
    set longitud(v) { 
        this._longitud = v; 
    }

    set nombreCiudad(valor){
        this._nombreCiudad = valor;
    }

    get region() {
        return this._region;
    }

    set region(valor) {
        this._region = valor;
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
