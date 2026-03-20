class Ciudadano{

static contadorCiudadanos=1;

    constructor(id, nivelFelicidad){
        this._id = id;
        this._nivelFelicidad = nivelFelicidad;

        this._vivienda = null;
        this._empleo = null;
    }

     static crearCiudadano(){
        const  random= Math.floor(Math.random() * (80 - 40 + 1)) + 40;
        const ciudadano=new Ciudadano(this.contadorCiudadanos++,random);
        return ciudadano;
    }

actualizarFelicidadIndividual(ciudad){

    let factoresPositivos = 0;
    let factoresNegativos = 0;

    /* vivienda */

    if(this._vivienda !== null){
        factoresPositivos += 20;
    }else{
        factoresNegativos += 20;
    }

    /* empleo */

    if(this._empleo !== null){
        factoresPositivos += 15;
    }else{
        factoresNegativos += 15;
    }

    /* servicios y parques */

    if(this._vivienda !== null){

        const xCasa = this._vivienda._x;
        const yCasa = this._vivienda._y;

        for(let i = 0; i < ciudad.edificios.length; i++){

            const edificio = ciudad.edificios[i];

            const distancia = calcularDistancia(
                xCasa,
                yCasa,
                edificio._x,
                edificio._y
            );

            /* servicios */

            if(edificio._radio !== undefined){

                if(distancia <= edificio._radio){
                    factoresPositivos += edificio._beneficio;
                }

            }

            /* parques */

            if(edificio._tipo === "Parque"){
                factoresPositivos += 5;
            }

        }

    }

    this._nivelFelicidad = factoresPositivos - factoresNegativos;

}

 calcularDistancia(x1,y1,x2,y2){

    return Math.abs(x1 - x2) + Math.abs(y1 - y2);

}
}
