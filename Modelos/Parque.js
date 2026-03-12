const tipoParque = {
    Parque: "Parque"
}

class Parque extends Edificio{

    static contadorParques = 1;

    constructor(nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad, aumentoFelicidad){
        super("Parque", nombre, tipo, costoConstruccion, consumoAgua, consumoElectricidad);
        this._aumentoFelicidad = aumentoFelicidad;
    }

    static crearParque(nombreParque){

        const nombreFinal = nombreParque && nombreParque.trim()
            ? nombreParque.trim()
            : `Parque ${Parque.contadorParques++}`;

        const parque = new Parque(
            nombreFinal,
            tipoParque.Parque,
            1500,
            0,
            0,
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