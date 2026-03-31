class Ciudadano {

    static contadorCiudadanos = 1;

    constructor(id, nivelFelicidad){
        this.id = id;

        this.felicidadBase = nivelFelicidad; // ← guardas la inicial
        this.nivelFelicidad = nivelFelicidad;

        this.vivienda = null;
        this.empleo = null;
    }

    static crearCiudadano(){
        const random = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
        return new Ciudadano(this.contadorCiudadanos++, random);
    }

    actualizarFelicidadIndividual(ciudad){

        let modificador = 0;

        /* vivienda */
        if(this.vivienda !== null){
            modificador += 20;
        } else {
            modificador -= 20;
        }

        /* empleo */
        if(this.empleo !== null){
            modificador += 15;
        } else {
            modificador -= 15;
        }

        /* servicios y parques */
        if(this.vivienda !== null){

            const xCasa = this.vivienda.x;
            const yCasa = this.vivienda.y;

            for(let i = 0; i < ciudad.edificios.length; i++){

                const edificio = ciudad.edificios[i];

                if(edificio.x === undefined || edificio.y === undefined){
                    continue;
                }

                const distancia = Ciudadano.calcularDistancia(
                    xCasa,
                    yCasa,
                    edificio.x,
                    edificio.y
                );

                if(edificio.radio !== undefined && edificio.beneficio !== undefined){
                    if(distancia <= edificio.radio){
                        modificador += edificio.beneficio;
                    }
                }

                if(edificio.tipo === "Parque"){
                    modificador += 5;
                }
            }
        }

        
        this.nivelFelicidad = this.felicidadBase + modificador;

        // limitar
        this.nivelFelicidad = Math.max(0, Math.min(100, this.nivelFelicidad));
    }

    static calcularDistancia(x1, y1, x2, y2){
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}