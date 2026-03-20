console.log("Demoliciones.js cargado");

function modalidadDemolicion(ciudad,x,y){
        
    if(ciudad.mapa._matriz[x][y] !== "g"){
        const encontrado = buscarEdificioEnPosicion(ciudad, x, y);
        if (!encontrado) return;

        const { edificio, indice } = encontrado;

        UIDemolicion.mostrarConfirmacionDemolicion(edificio._nombre, function() {
            demoler(ciudad, edificio, indice);
        }, function() {
            modalidad = "ninguna";
        });

        verificarAfectados(ciudad,indice);

    }
}

function verificarAfectados(ciudad,i){

    const edificio = ciudad.edificios[i];

    const conResidencias = !!(edificio._ciudadanosViviendo && edificio._ciudadanosViviendo.length > 0);
    const conEmpleos = !!(edificio._ciudadanosEmpleados && edificio._ciudadanosEmpleados.length > 0);

    if (conResidencias || conEmpleos) {
        UIDemolicion.agregarAvisoAfectados(conResidencias, conEmpleos);
    }

}

function demoler(ciudad, edificio, i){

    const codigoMapa = edificio._codigoMapa || (ciudad.mapa._matriz[edificio._x] && ciudad.mapa._matriz[edificio._x][edificio._y]);
    const tamano = obtenerTamanoEdificio(codigoMapa);

    const costo = edificio._costoConstruccion;
    const recuperado = costo / 2;

    /* liberar ciudadanos de vivienda */

    if(edificio._ciudadanosViviendo){

        for(let j = 0; j < edificio._ciudadanosViviendo.length; j++){

            const ciudadano = edificio._ciudadanosViviendo[j];

            if(ciudadano){
                ciudadano._vivienda = null;
            }

        }

        edificio._ciudadanosViviendo = [];
    }

    /* liberar ciudadanos de empleo */

    if(edificio._ciudadanosEmpleados){

        for(let j = 0; j < edificio._ciudadanosEmpleados.length; j++){

            const ciudadano = edificio._ciudadanosEmpleados[j];

            if(ciudadano){
                ciudadano._empleo = null;
            }

        }

        edificio._ciudadanosEmpleados = [];
    }

    /* actualizar mapa */

    for (let dx = 0; dx < tamano.alto; dx++) {
        for (let dy = 0; dy < tamano.ancho; dy++) {
            const nx = edificio._x + dx;
            const ny = edificio._y + dy;
            if (nx < 0 || ny < 0 || nx >= ciudad.mapa._tamanio || ny >= ciudad.mapa._tamanio) continue;
            ciudad.mapa._matriz[nx][ny] = "g";
        }
    }

    /* eliminar edificio */

    ciudad.edificios.splice(i,1);

    /* devolver dinero */

    ciudad.dinero += recuperado;

    UIDemolicion.mostrarResultadoDemolicion(recuperado);

    modalidad = "ninguna";
    
    CiudadStorage.guardar(ciudad);

    mostrarDatosCiudad(ciudad);

    UIMapa.renderizarMapa(ciudad);

}

function buscarEdificioEnPosicion(ciudad, x, y) {
    if (!Array.isArray(ciudad.edificios)) return null;

    for (let i = 0; i < ciudad.edificios.length; i++) {
        const edificio = ciudad.edificios[i];
        if (!edificio) continue;

        const codigoMapa = edificio._codigoMapa || (ciudad.mapa._matriz[edificio._x] && ciudad.mapa._matriz[edificio._x][edificio._y]);
        const tamano = obtenerTamanoEdificio(codigoMapa);

        const dentroX = x >= edificio._x && x < edificio._x + tamano.alto;
        const dentroY = y >= edificio._y && y < edificio._y + tamano.ancho;

        if (dentroX && dentroY) {
            return { edificio, indice: i };
        }
    }

    return null;
}

function obtenerTamanoEdificio(tipoElegido) {
    if (window.TamanosEdificios && typeof TamanosEdificios.obtenerTamano === "function") {
        return TamanosEdificios.obtenerTamano(tipoElegido);
    }

    return { ancho: 1, alto: 1 };
}
