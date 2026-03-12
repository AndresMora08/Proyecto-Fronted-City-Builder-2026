
class Via extends Edificio {
    static contadorVias = 1;

    constructor(nombre, tipo, costoConstruccion , consumoAgua , consumoElectricidad,x,y ) {
       
        super("Via", nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y);
    }


    static crearVia(nombreVia,x,y) {
        const nombreFinal = nombreVia && nombreVia.trim()
            ? nombreVia.trim()
            : `Via ${Via.contadorVias++}`;

        return new Via(nombreFinal, "Vía", 100, 0, 0,x,y);
    }
}