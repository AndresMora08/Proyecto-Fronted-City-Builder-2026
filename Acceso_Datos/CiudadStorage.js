// CiudadStorage.js
class CiudadStorage {
    static clave = "ciudadGuardada";

    // Guardar ciudad en localStorage
    static guardar(ciudad) {
        const ciudadPlano = {
            nombreCiudad: ciudad.nombreCiudad,
            dinero: ciudad.dinero,
            electricidad: ciudad.electricidad,
            agua: ciudad.agua,
            alimento: ciudad.alimento,
            poblacion: ciudad.poblacion,
            puntuacion: ciudad.puntuacion,
            tamanioMapa: ciudad.mapa.tamanio,
            matrizMapa: ciudad.mapa.matriz
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
            ciudadPlano.dinero,
            ciudadPlano.electricidad,
            ciudadPlano.agua,
            ciudadPlano.alimento,
            ciudadPlano.poblacion,
            ciudadPlano.puntuacion
        );
        ciudad.mapa=mapa;
        return ciudad;
    }

    static limpiar() {
        localStorage.removeItem(this.clave);
    }
}