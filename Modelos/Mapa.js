class Mapa{

    constructor(tamanio){

        this.tamanio = tamanio;

        this.matriz = this.crearMatriz();

        
    }

        crearMatriz() {

        let matriz = [];

        for (let i = 0; i < this.tamanio; i++) {

            matriz[i] = [];

            for (let j = 0; j < this.tamanio; j++) {

                matriz[i][j] = "g";

            }
        }

        return matriz;
    }

    }
