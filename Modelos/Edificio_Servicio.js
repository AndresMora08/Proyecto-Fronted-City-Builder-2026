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
        super(nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad,x,y);
        this.radio = radio;
        this.beneficio = beneficio;

    }

    static crearEstacionPolicia(nombreEstacion,x,y,codigoMapa){
        const nombreFinal = nombreEstacion && nombreEstacion.trim()
            ? nombreEstacion.trim()
            : `Estacion de policia ${Edificio_Servicios.contadorEstacionPolicia++}`;

        const estacionPolicia = new Edificio_Servicios(nombreFinal, tipoServicio.EstacionPolicia, 4000, 0, 15,x,y, 5, 10);
        estacionPolicia.setCodigoMapa(codigoMapa);
        return estacionPolicia;
    }

    static crearEstacionBomberos(nombreEstacion,x,y,codigoMapa){
        const nombreFinal = nombreEstacion && nombreEstacion.trim()
            ? nombreEstacion.trim()
            : `Estacion de bomberos ${Edificio_Servicios.contadorEstacionBombreos++}`;

        const estacionBomberos = new Edificio_Servicios(nombreFinal, tipoServicio.EstacionBomberos, 4000, 0, 15,x,y, 5, 10);
        estacionBomberos.setCodigoMapa(codigoMapa);
        return estacionBomberos;
    }

    static crearHospital(nombreHospital,x,y,codigoMapa){
        const nombreFinal = nombreHospital && nombreHospital.trim()
            ? nombreHospital.trim()
            : `Hospital ${Edificio_Servicios.contadorHospital++}`;

        const hospital = new Edificio_Servicios(nombreFinal, tipoServicio.Hospital, 6000, 10, 20,x,y, 7, 10);
        hospital.setCodigoMapa(codigoMapa);
        return hospital;
    }
     // GETTERS

    getRadio(){
        return this.radio;
    }

    getBeneficio(){
        return this.beneficio;
    }

    // SETTERS

    setRadio(radio){
        this.radio = radio;
    }

    setBeneficio(beneficio){
        this.beneficio = beneficio;
    }
}