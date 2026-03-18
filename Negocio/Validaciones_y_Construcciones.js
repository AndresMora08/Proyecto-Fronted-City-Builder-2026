
    

    function modalidadConstruccion(ciudad, x, y, tipoElegido){
        const mensajeAusuario = document.getElementById("mensajeAusuario");
        const objeto = objetoVacio(tipoElegido,x,y);
        const costo = objeto.costoConstruccion;

        const validacion = validarConstruccion(costo, x, y, ciudad, tipoElegido);

        if(validacion){

            mensajeAusuario.innerHTML = `
                <div> 
                    <label>Ingrese un nombre para el edificio</label>
                    <input type="text" id="nombreEdificio" value="${objeto.nombre}">
                    <button id="confirmarNombre">Confirmar</button>
                </div>
            `;

            const confirmarNombre = document.getElementById("confirmarNombre");

            confirmarNombre.addEventListener("click", function(){

                const nombreEdificio = document
                    .getElementById("nombreEdificio")
                    .value
                    .trim();

                mensajeAusuario.innerHTML = "";
                

                construir(ciudad, x, y, objeto, tipoElegido, nombreEdificio);

            });

        }

        else{

            mensajeAusuario.innerHTML = `
                <div> 
                    <p>No tienes suficiente dinero o no hay vía cercana</p>
                </div>
            `;

            setTimeout(function(){
                mensajeAusuario.innerHTML = "";
            },4000);

        }

    }

 function objetoVacio(tipoElegido, x, y) {

    let edificio;
    

    // VIA
    if (tipoElegido === "r") {
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
        edificio = Edificio_Comercial.crearCenrtoComercial(null, x, y,tipoElegido);
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

    function validarConstruccion(costo, x, y, ciudad, tipoElegido){

        if(
            ciudad.mapa.matriz[x][y] !== "g" ||
            ciudad.dinero < costo ||
            !tieneViaAdyacente(x,y,ciudad,tipoElegido)
        ){
            return false;
        }

        return true;

    }

    function tieneViaAdyacente(x,y,ciudad,tipoElegido){

        if (tipoElegido === "r") {
            return true;
        }

        const mapa = ciudad.mapa.matriz;
        const tamaño = ciudad.mapa.tamanio;

        const direcciones = [
            [-1,0],
            [1,0],
            [0,-1],
            [0,1]
        ];

        for (let i = 0; i < direcciones.length; i++) {

            const nuevaX = x + direcciones[i][0];
            const nuevaY = y + direcciones[i][1];

            if(
                nuevaX >= 0 &&
                nuevaY >= 0 &&
                nuevaX < tamaño &&
                nuevaY < tamaño
            ){
                if(mapa[nuevaX][nuevaY] === "r"){
                    return true;
                }
            }

        }

        return false;

    }

    function construir(ciudad,x,y,objeto,tipoElegido,nombreEdificio){

        ciudad.mapa.matriz[x][y] = tipoElegido;
        console.log("objeto", objeto);
        console.log("Dinero antes:", ciudad.dinero);
        console.log("Costo:", objeto.costoConstruccion);
        objeto.nombre=nombreEdificio;

        ciudad.dinero-=objeto.costoConstruccion;
       
        ciudad.edificios.push(objeto);

        mensajeAusuario.innerHTML = `
            <div>
                <p>Construcción exitosa</p>
            </div>
        `;

        setTimeout(function(){
            mensajeAusuario.innerHTML = "";
        },5000);
        document.getElementById("mapaContainer").classList.remove("modo-construccion");
        modalidad="ninguna";
        
        CiudadStorage.guardar(ciudad);
        mostrarDatosCiudad(ciudad);
       renderizarMapa(ciudad);
       

    }

