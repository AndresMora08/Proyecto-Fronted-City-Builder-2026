const tipoIndustrial = {
    Fabrica: "Fabrica",
    Granja: "Granja"
}

class Edificio_Industrial extends Edificio{

    static contadorFabrica = 1;
    static contadorGranja = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y ,produccion, empleos){
        super("Edificio_Industrial",nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad,x,y);
        this._produccion = produccion;
        this._empleos = empleos;
    }

    static crearFabrica(nombreIndustria,x,y){
        const nombreFinal = nombreIndustria && nombreIndustria.trim()
            ? nombreIndustria.trim()
            : `Fabrica ${Edificio_Industrial.contadorFabrica++}`;

        const Fabrica = new Edificio_Industrial(nombreFinal, tipoIndustrial.Fabrica, 5000, 15, 20,x,y, 800, 15);
        return Fabrica;
    }

    static crearGranja(nombreIndustria,x,y){
        const nombreFinal = nombreIndustria && nombreIndustria.trim()
            ? nombreIndustria.trim()
            : `Granja ${Edificio_Industrial.contadorGranja++}`;

        const Granja = new Edificio_Industrial(nombreFinal, tipoIndustrial.Granja, 3000, 10, 0,x,y, 50, 8);
        return Granja;
    }

    get produccion(){
        return this._produccion;
    }

    set produccion(valor){
        this._produccion = valor;
    }

    get empleos(){
        return this._empleos;
    }

    set empleos(valor){
        this._empleos = valor;
    }
}