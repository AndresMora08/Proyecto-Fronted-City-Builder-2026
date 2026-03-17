console.log("Demoliciones.js cargado");

function modalidadDemolicion(ciudad,x,y){

    const mensajeAusuario = document.getElementById("mensajeAusuario");
        
    if(ciudad.mapa.matriz[x][y] !== "g"){
                    
        for(let i = 0; i < ciudad.edificios.length; i++){
                        
            if(ciudad.edificios[i].x === x && ciudad.edificios[i].y === y){
                            
                const edificio = ciudad.edificios[i];

                mensajeAusuario.innerHTML = `
                <div>
                <p>¿Demoler ${edificio.nombre}?</p>
                <button id="btnSIdemoler">SI</button>
                <button id="btnNOdemoler">NO</button>
                </div>`;

                verificarAfectados(ciudad,i,mensajeAusuario);
                            
                document.getElementById("btnSIdemoler")
                .addEventListener("click",function(){
                    demoler(ciudad,x,y,i);
                });

                document.getElementById("btnNOdemoler")
                .addEventListener("click",function(){
                    mensajeAusuario.innerHTML = "";
                    modalidad = "ninguna";
                });
                            
                break;
            }
        }

    }
}

function verificarAfectados(ciudad,i,mensajeAusuario){

    const edificio = ciudad.edificios[i];

    if(edificio.ciudadanosViviendo && edificio.ciudadanosViviendo.length > 0){

        mensajeAusuario.innerHTML += `
        <div>
        <p>Habrá ciudadanos afectados (pérdida de residencia)</p>
        </div>`;

    }

    if(edificio.ciudadanosEmpleados && edificio.ciudadanosEmpleados.length > 0){

        mensajeAusuario.innerHTML += `
        <div>
        <p>Habrá ciudadanos afectados (pérdida de empleo)</p>
        </div>`;

    }

}

function demoler(ciudad,x,y,i){

    const mensajeAusuario = document.getElementById("mensajeAusuario");

    const edificio = ciudad.edificios[i];

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

    ciudad.mapa.matriz[x][y] = "g";

    /* eliminar edificio */

    ciudad.edificios.splice(i,1);

    /* devolver dinero */

    ciudad.dinero += recuperado;

    mensajeAusuario.innerHTML = `
    <div>
    <p>Edificio demolido</p>
    <p>Dinero recuperado: ${recuperado}</p>
    </div>
    `;

    setTimeout(function(){
        mensajeAusuario.innerHTML = "";
    },4000);

    modalidad = "ninguna";
    
    CiudadStorage.guardar(ciudad);

    mostrarDatosCiudad(ciudad);

    renderizarMapa(ciudad);

}