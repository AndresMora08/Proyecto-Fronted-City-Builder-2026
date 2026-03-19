function modalidadConstruccion(ciudad, x, y, tipoElegido){
    const objeto = objetoVacio(tipoElegido,x,y);
    const costo = objeto.costoConstruccion;

    const origen = encontrarOrigenConstruccion(costo, x, y, ciudad, tipoElegido);

    if(origen){
        UIConstruccion.mostrarPromptNombreEdificio(objeto.nombre, function(nombreEdificio) {
            construir(ciudad, origen.x, origen.y, objeto, tipoElegido, nombreEdificio);
        });
    }
    else{
        UIConstruccion.mostrarErrorConstruccion();
    }
}

function objetoVacio(tipoElegido, x, y) {

    let edificio;
    
    // VIA
    if (tipoElegido === "r" || tipoElegido === "r1" || tipoElegido === "r2") {
        edificio = Via.crearVia(null, x, y,tipoElegido);
    }
    else if(tipoElegido === "r1") {
        edificio = Via.crearVia(null, x, y,tipoElegido);
    }

    // RESIDENCIAL
    else if (tipoElegido === "R1") {
        edificio = Edificio_Residencial.crearCasa(null, x, y,tipoElegido);
    }

    else if (tipoElegido === "R2") {
        edificio = Edificio_Residencial.crearApartamento(null, x, y,tipoElegido);
    }

    // COMERCIAL
    else if (tipoElegido === "C1") {
        edificio = Edificio_Comercial.crearTienda(null, x, y,tipoElegido);
    }

    else if (tipoElegido === "C2") {
        edificio = Edificio_Comercial.crearCentroComercial(null, x, y,tipoElegido);
    }

    // INDUSTRIAL
    else if (tipoElegido === "I1") {
        edificio = Edificio_Industrial.crearFabrica(null, x, y,tipoElegido);
    }

    else if (tipoElegido === "I2") {
        edificio = Edificio_Industrial.crearGranja(null, x, y,tipoElegido);
    }

    // SERVICIOS
    else if (tipoElegido === "S1") {
        edificio = Edificio_Servicios.crearEstacionPolicia(null, x, y,tipoElegido);
    }

    else if (tipoElegido === "S2") {
        edificio = Edificio_Servicios.crearEstacionBomberos(null, x, y,tipoElegido);
    }

    else if (tipoElegido === "S3") {
        edificio = Edificio_Servicios.crearHospital(null, x, y,tipoElegido);
    }

    // UTILIDADES
    else if (tipoElegido === "U1") {
        edificio = Planta_Utilidad.crearPlantaElectrica(null, x, y,tipoElegido);
    }

    else if (tipoElegido === "U2") {
        edificio = Planta_Utilidad.crearPlantaAgua(null, x, y,tipoElegido);
    }

    // PARQUE
    else if (tipoElegido === "P1") {
        edificio = Parque.crearParque(null, x, y,tipoElegido);
    }

    return edificio;
}

function encontrarOrigenConstruccion(costo, x, y, ciudad, tipoElegido){

    const tamano = obtenerTamanoEdificio(tipoElegido);

    if (ciudad.dinero < costo) return null;
    if (ciudad.mapa.matriz[x][y] !== "g") return null;

    for (let dx = 0; dx < tamano.alto; dx++) {
        for (let dy = 0; dy < tamano.ancho; dy++) {
            const origenX = x - dx;
            const origenY = y - dy;

            if (!espacioDisponible(origenX, origenY, ciudad, tamano)) continue;
            if (!tieneViaAdyacente(origenX, origenY, ciudad, tipoElegido, tamano)) continue;

            return { x: origenX, y: origenY };
        }
    }

    return null;

}

function espacioDisponible(x, y, ciudad, tamano) {
    const mapa = ciudad.mapa.matriz;
    const tamanio = ciudad.mapa.tamanio;

    for (let dx = 0; dx < tamano.alto; dx++) {
        for (let dy = 0; dy < tamano.ancho; dy++) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx < 0 || ny < 0 || nx >= tamanio || ny >= tamanio) {
                return false;
            }

            if (mapa[nx][ny] !== "g") {
                return false;
            }
        }
    }

    return true;
}

function tieneViaAdyacente(x,y,ciudad,tipoElegido,tamanoEdificio){

    if (window.TamanosEdificios && TamanosEdificios.esVia(tipoElegido)) {
        return true;
    }

    const mapa = ciudad.mapa.matriz;
    const tamanioMapa = ciudad.mapa.tamanio;

    const direcciones = [
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
    ];

    for (let dx = 0; dx < tamanoEdificio.alto; dx++) {
        for (let dy = 0; dy < tamanoEdificio.ancho; dy++) {
            const celdaX = x + dx;
            const celdaY = y + dy;

            for (let i = 0; i < direcciones.length; i++) {

                const nuevaX = celdaX + direcciones[i][0];
                const nuevaY = celdaY + direcciones[i][1];

                if(
                    nuevaX >= 0 &&
                    nuevaY >= 0 &&
                    nuevaX < tamanioMapa &&
                    nuevaY < tamanioMapa
                ){
                    if(mapa[nuevaX][nuevaY] === "r" || mapa[nuevaX][nuevaY] === "r1" || mapa[nuevaX][nuevaY] === "r2"){
                        return true;
                    }
                }

            }
        }
    }

    return false;

}

function construir(ciudad,x,y,objeto,tipoElegido,nombreEdificio){

    const tamano = obtenerTamanoEdificio(tipoElegido);
    objeto.x = x;
    objeto.y = y;

    for (let dx = 0; dx < tamano.alto; dx++) {
        for (let dy = 0; dy < tamano.ancho; dy++) {
            const nx = x + dx;
            const ny = y + dy;
            ciudad.mapa.matriz[nx][ny] = (dx === 0 && dy === 0) ? tipoElegido : "o";
        }
    }
    console.log("objeto", objeto);
    console.log("Dinero antes:", ciudad.dinero);
    console.log("Costo:", objeto.costoConstruccion);
    objeto.nombre=nombreEdificio;

    ciudad.dinero-=objeto.costoConstruccion;
       
    ciudad.edificios.push(objeto);

    UIConstruccion.mostrarExitoConstruccion();
    document.getElementById("mapaContainer").classList.remove("modo-construccion");
    modalidad="ninguna";
        
    CiudadStorage.guardar(ciudad);
    mostrarDatosCiudad(ciudad);
    UIMapa.renderizarMapa(ciudad);
}

function obtenerTamanoEdificio(tipoElegido) {
    if (window.TamanosEdificios && typeof TamanosEdificios.obtenerTamano === "function") {
        return TamanosEdificios.obtenerTamano(tipoElegido);
    }

    return { ancho: 1, alto: 1 };
}