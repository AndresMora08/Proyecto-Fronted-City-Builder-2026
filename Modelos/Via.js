
class Via extends Edificio {

    static contadorVias = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad, x, y) {

        super(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad, x, y);

    }





    static crearVia(nombreVia,x,y,codigoMapa) {
        const nombreFinal = nombreVia && nombreVia.trim()
            ? nombreVia.trim()
            : `Via ${Via.contadorVias++}`;
        const via=new Via(nombreFinal, "Vía", 100, 0, 0,x,y);
        via.setCodigoMapa(codigoMapa);
        return via;
    }
}