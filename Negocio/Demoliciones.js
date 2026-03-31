function modalidadDemolicion(ciudad,x,y){
        
    if(ciudad.mapa.matriz[x][y] !== "g"){
        const encontrado = buscarEdificioEnPosicion(ciudad, x, y);
        if (!encontrado) return;

        const { edificio, indice } = encontrado;
       
        const afectados = verificarAfectados(ciudad, indice);

        UIDemolicion.mostrarConfirmacionDemolicion(edificio.nombre, afectados.conResidencias, afectados.conEmpleos, function() {
            demoler(ciudad, edificio, indice);
            
             console.log("DEMOLIENDO:", edificio.nombre);
        }, function() {
            modalidad = "ninguna";
        });

        

    }
}

function verificarAfectados(ciudad,i){

    const edificio = ciudad.edificios[i];

    const conResidencias = !!(edificio.ciudadanosViviendo && edificio.ciudadanosViviendo.length > 0);
    const conEmpleos = !!(edificio.ciudadanosEmpleados && edificio.ciudadanosEmpleados.length > 0);

    return { conResidencias, conEmpleos };
}

function demoler(ciudad, edificio, i){

    const codigoMapa = edificio.codigoMapa || (ciudad.mapa.matriz[edificio.x] && ciudad.mapa.matriz[edificio.x][edificio.y]);
    const tamano = obtenerTamanoEdificio(codigoMapa);

    const costo = edificio.costoConstruccion;
    const recuperado = costo / 2;

    /* liberar ciudadanos de vivienda */

    if(edificio.ciudadanosViviendo){

        for(let j = 0; j < edificio.ciudadanosViviendo.length; j++){

            const ciudadano = edificio.ciudadanosViviendo[j];

            if(ciudadano){
                ciudadano.vivienda = null;
            }

        }

        edificio.ciudadanosViviendo = [];
    }

    /* liberar ciudadanos de empleo */

    if(edificio.ciudadanosEmpleados){

        for(let j = 0; j < edificio.ciudadanosEmpleados.length; j++){

            const ciudadano = edificio.ciudadanosEmpleados[j];

            if(ciudadano){
                ciudadano.empleo = null;
            }

        }

        edificio.ciudadanosEmpleados = [];
    }

    /* actualizar mapa */

    for (let dx = 0; dx < tamano.alto; dx++) {
        for (let dy = 0; dy < tamano.ancho; dy++) {
            const nx = edificio.x + dx;
            const ny = edificio.y + dy;
            if (nx < 0 || ny < 0 || nx >= ciudad.mapa.tamanio || ny >= ciudad.mapa.tamanio) continue;
            ciudad.mapa.matriz[nx][ny] = "g";
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

        const codigoMapa = edificio.codigoMapa || (ciudad.mapa.matriz[edificio.x] && ciudad.mapa.matriz[edificio.x][edificio.y]);
        const tamano = obtenerTamanoEdificio(codigoMapa);

        const dentroX = x >= edificio.x && x < edificio.x + tamano.alto;
        const dentroY = y >= edificio.y && y < edificio.y + tamano.ancho;

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