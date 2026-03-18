const tipoParque = {
    Parque: "Parque"
}

class Parque extends Edificio{

    static contadorParques = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y, aumentoFelicidad){
        super( nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y);
        this._aumentoFelicidad = aumentoFelicidad;
    }

    static crearParque(nombreParque,x,y,codigoMapa){

        const nombreFinal = nombreParque && nombreParque.trim()
            ? nombreParque.trim()
            : `Parque ${Parque.contadorParques++}`;

        const parque = new Parque(
            nombreFinal,
            tipoParque.Parque,
            1500,
            0,
            0,
            x,
            y,
            5
        );
        parque.setCodigoMapa(codigoMapa);
        return parque;
    }

    getAumentoFelicidad(){
        return this._aumentoFelicidad;
    }

    setAumentoFelicidad(valor){
        this._aumentoFelicidad = valor;
    }
}