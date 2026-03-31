const tipoUtilidad = {
    plantaElectrica: "Planta electrica",
    PlantaAgua: "Planta de agua"
}

class Planta_Utilidad extends Edificio{

    static contadorPlantaElectrica = 1;
    static contadorPlantaAgua = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y, produccion){
        super(nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad,x,y);
        this.produccion = produccion;
    }

    static crearPlantaElectrica(nombrePlanta,x,y,codigoMapa){
        const nombreFinal = nombrePlanta && nombrePlanta.trim()
            ? nombrePlanta.trim()
            : `Planta electrica ${Planta_Utilidad.contadorPlantaElectrica++}`;

        const plantaElectrica = new Planta_Utilidad(nombreFinal, tipoUtilidad.plantaElectrica, 10000, 0, 0,x,y, 200);
        plantaElectrica.setCodigoMapa(codigoMapa);
        return plantaElectrica;
    }

    static crearPlantaAgua(nombrePlanta,x,y,codigoMapa){
        const nombreFinal = nombrePlanta && nombrePlanta.trim()
            ? nombrePlanta.trim()
            : `Planta de agua ${Planta_Utilidad.contadorPlantaAgua++}`;

        const plantaAgua = new Planta_Utilidad(nombreFinal, tipoUtilidad.PlantaAgua, 8000, 0, 20,x,y, 150);
        plantaAgua.setCodigoMapa(codigoMapa);
        return plantaAgua;
    }

    getProduccion(){
        return this.produccion;
    }

    setProduccion(valor){
        this.produccion = valor;
    }
}