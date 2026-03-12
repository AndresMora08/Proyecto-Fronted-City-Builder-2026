// CiudadStorage.js
class CiudadStorage {
    static clave = "ciudadGuardada";

    // Guardar ciudad en localStorage
    static guardar(ciudad) {
        let edificiosPlano=[];
        for (let i = 0; i < ciudad.edificios.length; i++) {

            let e = ciudad.edificios[i];

             let edificioSimple = {
                tipo: e.tipo,//error aqui que corrijo mañana
                nombre: e.nombre,
                x: e.x,
                y: e.y
    };

    edificiosPlano.push(edificioSimple);
}
        const ciudadPlano = {
            nombreCiudad: ciudad.nombreCiudad,
            dinero: ciudad.dinero,
            electricidad: ciudad.electricidad,
            agua: ciudad.agua,
            alimento: ciudad.alimento,
            poblacion: ciudad.poblacion,
            puntuacion: ciudad.puntuacion,
            tamanioMapa: ciudad.mapa.tamanio,
            matrizMapa: ciudad.mapa.matriz,
            edificios:edificiosPlano


        };
        localStorage.setItem(this.clave, JSON.stringify(ciudadPlano));
    }

    // Cargar ciudad desde localStorage
    static cargar() {
        const datos = localStorage.getItem(this.clave);
        if (!datos) return null;

        const ciudadPlano = JSON.parse(datos);
   

        // Reconstruir mapa
        const mapa = new Mapa(ciudadPlano.tamanioMapa);
        mapa.matriz = ciudadPlano.matrizMapa;
        

        // Reconstruir ciudad
        const ciudad = new Ciudad(
            ciudadPlano.nombreCiudad,
            Number(ciudadPlano.dinero),
            Number(ciudadPlano.electricidad),
            Number(ciudadPlano.agua),
            Number(ciudadPlano.alimento),
            Number(ciudadPlano.poblacion),
            Number(ciudadPlano.puntuacion)
        );
        ciudad.mapa=mapa;
        for (let i = 0; i < ciudadPlano.edificios.length; i++) {

    let e = ciudadPlano.edificios[i];
    let edificio;

    // RESIDENCIAL
    if (e.tipo === "R1") {
        edificio = Edificio_Residencial.crearCasa(e.nombre, e.x, e.y);
    }

    else if (e.tipo === "R2") {
        edificio = Edificio_Residencial.crearApartamento(e.nombre, e.x, e.y);
    }

    // COMERCIAL
    else if (e.tipo === "C1") {
        edificio = Edificio_Comercial.crearTienda(e.nombre, e.x, e.y);
    }

    else if (e.tipo === "C2") {
        edificio = Edificio_Comercial.crearCenrtoComercial(e.nombre, e.x, e.y);
    }

    // INDUSTRIAL
    else if (e.tipo === "I1") {
        edificio = Edificio_Industrial.crearFabrica(e.nombre, e.x, e.y);
    }

    else if (e.tipo === "I2") {
        edificio = Edificio_Industrial.crearGranja(e.nombre, e.x, e.y);
    }

    // SERVICIOS
    else if (e.tipo === "S1") {
        edificio = Edificio_Servicios.crearEstacionPolicia(e.nombre, e.x, e.y);
    }

    else if (e.tipo === "S2") {
        edificio = Edificio_Servicios.crearEstacionBomberos(e.nombre, e.x, e.y);
    }

    else if (e.tipo === "S3") {
        edificio = Edificio_Servicios.crearHospital(e.nombre, e.x, e.y);
    }

    // UTILIDADES
    else if (e.tipo === "U1") {
        edificio = Planta_Utilidad.crearPlantaElectrica(e.nombre, e.x, e.y);
    }

    else if (e.tipo === "U2") {
        edificio = Planta_Utilidad.crearPlantaAgua(e.nombre, e.x, e.y);
    }

    // PARQUE
    else if (e.tipo === "P1") {
        edificio = Parque.crearParque(e.nombre, e.x, e.y);
    }

    // VIA
    else if (e.tipo === "r") {
        edificio = Via.crearVia(e.nombre, e.x, e.y);
    }

    if (edificio) {
        ciudad.edificios.push(edificio);
    }
}
        return ciudad;
    }

    static limpiar() {
        localStorage.removeItem(this.clave);
    }
}