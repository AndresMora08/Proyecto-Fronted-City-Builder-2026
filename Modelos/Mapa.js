class Mapa{

    constructor(tamanio){

        this._tamanio = tamanio;

        this._matriz = this.crearMatriz();

        
    }

        crearMatriz() {

        let matriz = [];

        for (let i = 0; i < this._tamanio; i++) {

            matriz[i] = [];

            for (let j = 0; j < this._tamanio; j++) {

                matriz[i][j] = "g";

            }
        }

        return matriz;
    }

    }
