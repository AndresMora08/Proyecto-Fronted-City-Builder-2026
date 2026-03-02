const tipoIndustrial = {
    Fabrica: "Fabrica",
    Granja: "Granja"
}

class Edificio_Industrial extends Edificio{
    static contadorFabrica = 1;
    static contadorGranja = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad, produccion, empleos){
        super("Edificio_Industrial",nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad);
        this.produccion = produccion;
        this.empleos = empleos;
    }
    crearFabrica(nombreIndustria){
        const nombreFinal = nombreIndustria && nombreIndustria.trim()
            ? nombreIndustria.trim()
            : `Fabrica ${Edificio_Industrial.contadorFabrica++}`;

        const Fabrica = new Edificio_Industrial(nombreFinal, tipoIndustrial.Fabrica, 5000, 15, 20, 800, 15);
        return Fabrica;
    }

    crearGranja(nombreIndustria){
        const nombreFinal = nombreIndustria && nombreIndustria.trim()
            ? nombreIndustria.trim()
            : `Granja ${Edificio_Industrial.contadorGranja++}`;

        const Granja = new Edificio_Industrial(nombreFinal, tipoIndustrial.Granja, 3000, 10, 0, 50, 8);
        return Granja;
    }
}
