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
}
