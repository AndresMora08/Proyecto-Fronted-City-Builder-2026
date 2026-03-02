const tipoServicio = {
    EstacionPolicia: "Estacion de policia",
    EstacionBomberos: "Estacion de bombreos",
    Hospital: "Hospital"
}

class Edificio_Servicios extends Edificio{
    static contadorEstacionPolicia = 1;
    static contadorEstacionBombreos = 1;
    static contadorHospital =1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad, radio, beneficio){
        super("Edificio_Servicios",nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad);
        this.radio = radio;
        this.beneficio = beneficio;

    }

    crearEstacionPolicia(nombreEstacion){
        const nombreFinal = nombreEstacion && nombreEstacion.trim()
            ? nombreEstacion.trim()
            : `Estacion de policia ${Edificio_Servicios.contadorEstacionPolicia++}`;

        const EstacionPolicia = new Edificio_Servicios(nombreFinal, tipoServicio.EstacionPolicia, 4000, 0, 15, 5, 10);
        return EstacionPolicia;
    }

    crearEstacionBomberos(nombreEstacion){
        const nombreFinal = nombreEstacion && nombreEstacion.trim()
            ? nombreEstacion.trim()
            : `Estacion de bomberos ${Edificio_Servicios.contadorEstacionBombreos++}`;

        const EstacionBomberos = new Edificio_Servicios(nombreFinal, tipoServicio.EstacionBomberos, 4000, 0, 15, 5, 10);
        return EstacionBomberos;
    }

    crearHospital(nombreHospital){
        const nombreFinal = nombreHospital && nombreHospital.trim()
            ? nombreHospital.trim()
            : `Hospital ${Edificio_Servicios.contadorHospital++}`;

        const Hospital = new Edificio_Servicios(nombreFinal, tipoServicio.Hospital, 6000, 10, 20, 7, 10);
        return Hospital;
    }
}