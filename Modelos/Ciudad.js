class Ciudad{

    constructor(nombreCiudad, dinero=50000, electricidad=0, agua=0, alimento=0, poblacion=0, puntuacion=0){
    this.nombreCiudad = nombreCiudad;
    this.dinero = dinero;
    this.electricidad = electricidad;
    this.agua = agua;
    this.alimento = alimento;
    this.poblacion = poblacion;
    this.puntuacion = puntuacion;

    this.ciudadanos=[];
    this.edificios=[];
    this.mapa=null;
    }

}
