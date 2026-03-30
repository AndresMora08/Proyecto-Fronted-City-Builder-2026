// CiudadStorage.js
class CiudadStorage {
    static clave = "ciudadGuardada";

    // Guardar ciudad en localStorage
    static guardar(ciudad) {
        let edificiosPlano=[];
        for (let i = 0; i < ciudad.edificios.length; i++) {

            let e = ciudad.edificios[i];

             let edificioSimple = {
                codigoMapa: e._codigoMapa,

                nombre: e._nombre,
                x: e._x,
                y: e._y
    };

    edificiosPlano.push(edificioSimple);
}
        const ciudadPlano = {
            nombreCiudad: ciudad.nombreCiudad,
            region: ciudad.region || "",
            latitud: ciudad.latitud,
            longitud: ciudad.longitud, 
            dinero: ciudad.dinero,
            electricidad: ciudad.electricidad,
            agua: ciudad.agua,
            alimento: ciudad.alimento,
            poblacion: ciudad.poblacion,
            puntuacion: ciudad.puntuacion,
            tamanioMapa: ciudad.mapa._tamanio,
            matrizMapa: ciudad.mapa._matriz,
            edificios:edificiosPlano


        };
        localStorage.setItem(this.clave, JSON.stringify(ciudadPlano));
    }

    // Cargar ciudad desde localStorage
    static cargar() {
        const datos = localStorage.getItem(this.clave);
        if (!datos) return null;

        const ciudadPlano = JSON.parse(datos);
        const edificios=ciudadPlano.edificios;

        // Reconstruir mapa
        const mapa = new Mapa(ciudadPlano.tamanioMapa);
        mapa._matriz = ciudadPlano.matrizMapa;
        

        // Reconstruir ciudad
        const ciudad = new Ciudad(
            ciudadPlano.nombreCiudad,
            ciudadPlano.latitud,
            ciudadPlano.longitud,
            Number(ciudadPlano.dinero),
            Number(ciudadPlano.electricidad),
            Number(ciudadPlano.agua),
            Number(ciudadPlano.alimento),
            Number(ciudadPlano.poblacion),
            Number(ciudadPlano.puntuacion),
            ciudadPlano.region || ""
        );
        ciudad.mapa=mapa;
 if (ciudadPlano.edificios) {
    for (let i = 0; i < edificios.length; i++) {

        let e = ciudadPlano.edificios[i];
        let edificio;

    // RESIDENCIAL
    if (e.codigoMapa === "R1") {
        edificio = Edificio_Residencial.crearCasa(e.nombre, e.x, e.y,e.codigoMapa);
    }

    else if (e.codigoMapa=== "R2") {
        edificio = Edificio_Residencial.crearApartamento(e.nombre, e.x, e.y,e.codigoMapa);
    }

    // COMERCIAL
    else if (e.codigoMapa === "C1") {
        edificio = Edificio_Comercial.crearTienda(e.nombre, e.x, e.y,e.codigoMapa);
    }

    else if (e.codigoMapa === "C2") {
        edificio = Edificio_Comercial.crearCentroComercial(e.nombre, e.x, e.y,e.codigoMapa);
    }

    // INDUSTRIAL
    else if (e.codigoMapa=== "I1") {
        edificio = Edificio_Industrial.crearFabrica(e.nombre, e.x, e.y,e.codigoMapa);
    }

    else if (e.codigoMapa === "I2") {
        edificio = Edificio_Industrial.crearGranja(e.nombre, e.x, e.y,e.codigoMapa);
    }

    // SERVICIOS
    else if (e.codigoMapa=== "S1") {
        edificio = Edificio_Servicios.crearEstacionPolicia(e.nombre, e.x, e.y,e.codigoMapa);
    }

    else if (e.codigoMapa === "S2") {
        edificio = Edificio_Servicios.crearEstacionBomberos(e.nombre, e.x, e.y,e.codigoMapa);
    }

    else if (e.codigoMapa === "S3") {
        edificio = Edificio_Servicios.crearHospital(e.nombre, e.x, e.y,e.codigoMapa);
    }

    // UTILIDADES
    else if (e.codigoMapa=== "U1") {
        edificio = Planta_Utilidad.crearPlantaElectrica(e.nombre, e.x, e.y,e.codigoMapa);
    }

    else if (e.codigoMapa === "U2") {
        edificio = Planta_Utilidad.crearPlantaAgua(e.nombre, e.x, e.y,e.codigoMapa);
    }

    // PARQUE
    else if (e.codigoMapa === "P1") {
        edificio = Parque.crearParque(e.nombre, e.x, e.y,e.codigoMapa);
    }

    // VIA
    else if (e.codigoMapa === "r" || e.codigoMapa === "r1" || e.codigoMapa === "r2") {
        edificio = Via.crearVia(e.nombre, e.x, e.y,e.codigoMapa);
    }

    if (edificio) {
        ciudad.edificios.push(edificio);
    }
}
    }
     return ciudad;
    }

    static limpiar() {
        localStorage.removeItem(this.clave);
    }
}
