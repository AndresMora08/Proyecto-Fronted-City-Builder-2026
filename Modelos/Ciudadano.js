class Ciudadano{

static contadorCiudadanos=1;

    constructor(id, nivelFelicidad){
        this.id=id;
        this.nivelFelicidad=nivelFelicidad;

        this.vivienda=null;
        this.empleo=null;
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

    if(this.vivienda !== null){
        factoresPositivos += 20;
    }else{
        factoresNegativos += 20;
    }

    /* empleo */

    if(this.empleo !== null){
        factoresPositivos += 15;
    }else{
        factoresNegativos += 15;
    }

    /* servicios y parques */

    if(this.vivienda !== null){

        const xCasa = this.vivienda.x;
        const yCasa = this.vivienda.y;

        for(let i = 0; i < ciudad.edificios.length; i++){

            const edificio = ciudad.edificios[i];

            const distancia = calcularDistancia(
                xCasa,
                yCasa,
                edificio.x,
                edificio.y
            );

            /* servicios */

            if(edificio.radio !== undefined){

                if(distancia <= edificio.radio){
                    factoresPositivos += edificio.beneficio;
                }

            }

            /* parques */

            if(edificio.tipo === "Parque"){
                factoresPositivos += 5;
            }

        }

    }

    this.nivelFelicidad = factoresPositivos - factoresNegativos;

}

 calcularDistancia(x1,y1,x2,y2){

    return Math.abs(x1 - x2) + Math.abs(y1 - y2);

}
}
