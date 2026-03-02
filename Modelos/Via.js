
class Via extends Edificio {
    static contadorVias = 1;

    constructor(nombre, tipo, costoConstruccion = 100, consumoAgua = 0, consumoElectricidad = 0) {
       
        super("Via", nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad);
    }


    crearVia(nombreVia) {
        const nombreFinal = nombreVia && nombreVia.trim()
            ? nombreVia.trim()
            : `Via ${Via.contadorVias++}`;

        return new Via(nombreFinal, "Vía", 100, 0, 0);
    }
}