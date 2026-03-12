const tipoUtilidad = {
    plantaElectrica: "Planta electrica",
    PlantaAgua: "Planta de agua"
}

class Planta_Utilidad extends Edificio{

    static contadorPlantaElectrica = 1;
    static contadorPlantaAgua = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad, produccion){
        super("Planta_Utilidad",nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad);
        this._produccion = produccion;
    }

    static crearPlantaElectrica(nombrePlanta){
        const nombreFinal = nombrePlanta && nombrePlanta.trim()
            ? nombrePlanta.trim()
            : `Planta electrica ${Planta_Utilidad.contadorPlantaElectrica++}`;

        const plantaElectrica = new Planta_Utilidad(nombreFinal, tipoUtilidad.plantaElectrica, 10000, 0, 0, 200);
        return plantaElectrica;
    }

    static crearPlantaAgua(nombrePlanta){
        const nombreFinal = nombrePlanta && nombrePlanta.trim()
            ? nombrePlanta.trim()
            : `Planta de agua ${Planta_Utilidad.contadorPlantaAgua++}`;

        const plantaAgua = new Planta_Utilidad(nombreFinal, tipoUtilidad.PlantaAgua, 8000, 0, 20, 150);
        return plantaAgua;
    }

    get produccion(){
        return this._produccion;
    }

    set produccion(valor){
        this._produccion = valor;
    }
}