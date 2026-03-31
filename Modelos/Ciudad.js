class Ciudad{

    constructor(nombreCiudad, latitud, longitud, dinero=50000, electricidad=0, agua=0, alimento=0, poblacion=0, puntuacion=0, region=""){

        this.nombreCiudad = nombreCiudad;
        this.latitud = latitud; 
        this.longitud = longitud;
        this.region = region;

        this.dinero = Number(dinero);
        this.electricidad = Number(electricidad);
        this.agua = Number(agua);
        this.alimento = Number(alimento);
        this.poblacion = Number(poblacion);
        this.puntuacion = Number(puntuacion);

        // Propiedades iniciales
        this.ciudadanos = [];
        this.edificios = [];
        this.mapa = null;
    }
 


}
