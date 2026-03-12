const tipoResidencia = {
    Casa: "Casa",
    Apartamento: "Apartamento"
}

class Edificio_Residencial extends Edificio{

    static contadorCasas = 1;
    static contadorApartamentos = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad, x,y,capacidad){
        super("Edificio_Residencial",nombre, tipo, costoConstruccion,consumoAgua,consumoElectricidad,x,y);
        this._capacidad = capacidad;
    }

    static crearCasa(nombreResidencia,x,y){
        const nombreFinal = nombreResidencia && nombreResidencia.trim()
            ? nombreResidencia.trim()
            : `Casa ${Edificio_Residencial.contadorCasas++}`;

        const casa = new Edificio_Residencial(nombreFinal, tipoResidencia.Casa, 1000, 3, 5,x,y, 4);
        return casa;
    }

    static crearApartamento(nombreResidencia,x,y){
        const nombreFinal = nombreResidencia && nombreResidencia.trim()
            ? nombreResidencia.trim()
            : `Apartamento ${Edificio_Residencial.contadorApartamentos++}`;

        const apartamento = new Edificio_Residencial(nombreFinal, tipoResidencia.Apartamento, 3000, 10, 15,x,y, 12);
        return apartamento;
    }

    get capacidad(){
        return this._capacidad;
    }

    set capacidad(valor){
        this._capacidad = valor;
    }
}