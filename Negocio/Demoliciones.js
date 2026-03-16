
console.log("Demoliciones.js  cargado");
function modalidadDemolicion(ciudad,x,y){

    const mensajeAusuario=document.getElementById("mensajeAusuario");
        
    if(ciudad.mapa.matriz[x][y]!=="g"){
                    
        for(let i=0;i<ciudad.edificios.length;i++){
                        
            if(ciudad.edificios[i].x===x && ciudad.edificios[i].y===y){
                            
                const edificio = ciudad.edificios[i];

                mensajeAusuario.innerHTML=`<div>
                <p>¿Demoler ${edificio.nombre}?</p>
                <button id="btnSIdemoler">SI</button>
                <button id="btnNOdemoler">NO</button>
                </div>`;

                verificarAfectados(ciudad,x,y,i,mensajeAusuario);
                            
                document.getElementById("btnSIdemoler")
                .addEventListener("click",function(){
                    demoler(ciudad,x,y,i);
                });

                document.getElementById("btnNOdemoler")
                .addEventListener("click",function(){
                    mensajeAusuario.innerHTML="";
                    modalidad="ninguna";
                });
                            
                break;
            }
        }

    }
}



function verificarAfectados(ciudad,x,y,i,mensajeAusuario){

    const edificioElegido=ciudad.edificios[i];
    const edificioCodigo=edificioElegido.codigoMapa;
            
    if(edificioCodigo==="R1"|| edificioCodigo==="R2"){

        if(edificioElegido.capacidad && edificioElegido.capacidad.length>0){

            mensajeAusuario.innerHTML+=`<div>
            <p>Habrá ciudadanos afectados (pérdida de residencia)</p>
            </div>`;

        }
                
    }

    else if(edificioCodigo==="C1"||edificioCodigo==="C2"|| edificioCodigo==="I1"|| edificioCodigo==="I2"){

        if(edificioElegido.empleos && edificioElegido.empleos.length>0){

            mensajeAusuario.innerHTML+=`<div>
            <p>Habrá ciudadanos afectados (pérdida de empleo)</p>
            </div>`;

        }

    }

}



function demoler(ciudad,x,y,i){

    const mensajeAusuario=document.getElementById("mensajeAusuario");

    const edificio=ciudad.edificios[i];

    const costo=edificio.costoConstruccion;
    const recuperado=(costo/2);

    

    if(edificio.capacidad){

        for(let j=0;j<edificio.capacidad.length;j++){

            const ciudadano=edificio.capacidad[j];

            if(ciudadano){
                ciudadano.vivienda=null;
            }

        }

    }



    if(edificio.empleos){

        for(let j=0;j<edificio.empleos.length;j++){

            const ciudadano=edificio.empleos[j];

            if(ciudadano){
                ciudadano.empleo=null;
            }

        }

    }

    ciudad.mapa.matriz[x][y]="g";

    ciudad.edificios.splice(i,1);

    ciudad.dinero+=recuperado;

    mensajeAusuario.innerHTML=`
    <div>
    <p>Edificio demolido</p>
    <p>Dinero recuperado: ${recuperado}</p>
    </div>
    `;

    setTimeout(function(){
        mensajeAusuario.innerHTML="";
    },4000);

    modalidad="ninguna";
    
    CiudadStorage.guardar(ciudad);
    mostrarDatosCiudad(ciudad);
    renderizarMapa(ciudad);

}