const tipoParque = {
    Parque: "Parque"
}

class Parque extends Edificio{

    static contadorParques = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y, aumentoFelicidad){
        super("Parque", nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad,x,y);
        this._aumentoFelicidad = aumentoFelicidad;
    }

    static crearParque(nombreParque,x,y){

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

        return parque;
    }

    get aumentoFelicidad(){
        return this._aumentoFelicidad;
    }

    set aumentoFelicidad(valor){
        this._aumentoFelicidad = valor;
    }
}