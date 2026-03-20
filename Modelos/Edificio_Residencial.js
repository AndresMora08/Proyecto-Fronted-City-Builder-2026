const tipoResidencia = {
    Casa: "Casa",
    Apartamento: "Apartamento"
}

class Edificio_Residencial extends Edificio{

    static contadorCasas = 1;
    static contadorApartamentos = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad, x,y,ciudadanosViviendo,capacidadMaxima){
        super(nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad,x,y);
        this._ciudadanosViviendo=ciudadanosViviendo;
        this._capacidadMaxima=capacidadMaxima;
    }

    static crearCasa(nombreResidencia,x,y,codigoMapa){
        const nombreFinal = nombreResidencia && nombreResidencia.trim()
            ? nombreResidencia.trim()
            : `Casa ${Edificio_Residencial.contadorCasas++}`;
            const lista=[];

        const casa = new Edificio_Residencial(nombreFinal, tipoResidencia.Casa, 1000, 3, 5,x,y, lista,4);
        casa.setCodigoMapa(codigoMapa);
        return casa;
    }

    static crearApartamento(nombreResidencia,x,y,codigoMapa){
        const nombreFinal = nombreResidencia && nombreResidencia.trim()
            ? nombreResidencia.trim()
            : `Apartamento ${Edificio_Residencial.contadorApartamentos++}`;
        const lista=[];
        const apartamento = new Edificio_Residencial(nombreFinal, tipoResidencia.Apartamento, 3000, 10, 15,x,y, lista,12);
        apartamento.setCodigoMapa(codigoMapa);
        return apartamento;
    }

    agregarResidente(ciudadano){

        if(this._ciudadanosViviendo.length >= this._capacidadMaxima){
        return false;
        }

        this._ciudadanosViviendo.push(ciudadano);

        ciudadano._vivienda = this;

        return true;
}

}
