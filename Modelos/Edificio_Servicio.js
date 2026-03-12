const tipoServicio = {
    EstacionPolicia: "Estacion de policia",
    EstacionBomberos: "Estacion de bombreos",
    Hospital: "Hospital"
}

class Edificio_Servicios extends Edificio{
    static contadorEstacionPolicia = 1;
    static contadorEstacionBombreos = 1;
    static contadorHospital =1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y, radio, beneficio){
        super("Edificio_Servicios",nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad,x,y);
        this.radio = radio;
        this.beneficio = beneficio;

    }

    static crearEstacionPolicia(nombreEstacion,x,y){
        const nombreFinal = nombreEstacion && nombreEstacion.trim()
            ? nombreEstacion.trim()
            : `Estacion de policia ${Edificio_Servicios.contadorEstacionPolicia++}`;

        const EstacionPolicia = new Edificio_Servicios(nombreFinal, tipoServicio.EstacionPolicia, 4000, 0, 15,x,y, 5, 10);
        return EstacionPolicia;
    }

    static crearEstacionBomberos(nombreEstacion,x,y){
        const nombreFinal = nombreEstacion && nombreEstacion.trim()
            ? nombreEstacion.trim()
            : `Estacion de bomberos ${Edificio_Servicios.contadorEstacionBombreos++}`;

        const EstacionBomberos = new Edificio_Servicios(nombreFinal, tipoServicio.EstacionBomberos, 4000, 0, 15,x,y, 5, 10);
        return EstacionBomberos;
    }

    static crearHospital(nombreHospital,x,y){
        const nombreFinal = nombreHospital && nombreHospital.trim()
            ? nombreHospital.trim()
            : `Hospital ${Edificio_Servicios.contadorHospital++}`;

        const Hospital = new Edificio_Servicios(nombreFinal, tipoServicio.Hospital, 6000, 10, 20,x,y, 7, 10);
        return Hospital;
    }
}