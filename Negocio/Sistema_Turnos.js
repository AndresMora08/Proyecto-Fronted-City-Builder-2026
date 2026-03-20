
function ejecutarTurno(ciudad){
const produccion=calcularProduccion(ciudad);
const consumo=calcularConsumo(ciudad);
aplicarBalance(ciudad,produccion,consumo);
creacionNuevosCiudadanos(ciudad);
mostrarDatosCiudad(ciudad);
CiudadStorage.guardar(ciudad);
}

function calcularProduccion(ciudad){

    let produccion = {
        dinero: 0,
        electricidad: 0,
        agua: 0,
        alimento: 0
    };

    for(let i = 0; i < ciudad.edificios.length; i++){

        const edificio = ciudad.edificios[i];

        if(edificio._ingresos){
            
            produccion.dinero += edificio._ingresos;
        }

        if(edificio._produccion){
            if(edificio._tipo==="Fabrica"){
                 produccion.dinero+=edificio._produccion
             }

            if(edificio._tipo === "Planta Electrica"){
                produccion.electricidad += edificio._produccion;
            }

            if(edificio._tipo === "Planta de agua"){
                produccion.agua += edificio._produccion;
            }

            if(edificio._tipo === "Granja"){
                produccion.alimento += edificio._produccion;
            }

        }

    }

    return produccion;
}

function calcularConsumo(ciudad){

    let consumo = {
        electricidad: 0,
        agua: 0
    };

    for(let i = 0; i < ciudad.edificios.length; i++){

        const edificio = ciudad.edificios[i];

        consumo.electricidad += edificio._consumoElectricidad;
        consumo.agua += edificio._consumoAgua;

    }

    return consumo;
}

function aplicarBalance(ciudad, produccion, consumo){

    ciudad.dinero += produccion.dinero;

    ciudad.electricidad += produccion.electricidad - consumo.electricidad;

    ciudad.agua += produccion.agua - consumo.agua;

    ciudad.alimento += produccion.alimento;
}

function creacionNuevosCiudadanos(ciudad){

    const capacidadResidencial=calcularCapacidad(ciudad);
    const felicidadPromedio=calcularFelicidadPromedio(ciudad);
    const empleosDisponibles=verificarEmpleosDisponibles(ciudad);

    if(capacidadResidencial>ciudad.poblacion && (felicidadPromedio>60 || felicidadPromedio===-1) && empleosDisponibles){
        const Random=Math.floor(Math.random()*(3)+1);
        for(let i=1;i<=Random;i++){

            const ciudadanoCreado=Ciudadano.crearCiudadano();
            ciudad.ciudadanos.push(ciudadanoCreado);

        }
        asignarViviendas(ciudad);
        asignarEmpleos(ciudad);
        actualizarFelicidadGeneral(ciudad)
    }
}

function calcularCapacidad(ciudad){

    let capacidadResidencial=0;

    for(let i=0;i<ciudad.edificios.length;i++){
        const edificio=ciudad.edificios[i];
         if(edificio._tipo==="Casa"||edificio._tipo==="Apartamento"){
            capacidadResidencial+=edificio._capacidadMaxima;
         }
    }

    return capacidadResidencial;
}

function calcularFelicidadPromedio(ciudad){
   
    let felicidadTotal=0;
    let felicidadPromedio=0;
    if(ciudad.ciudadanos.length>0){
        for(let i=0;i<ciudad.ciudadanos.length;i++){
            const ciudadano=ciudad.ciudadanos[i];
            felicidadTotal+=ciudadano._nivelFelicidad;
        }
            felicidadPromedio=felicidadTotal/ciudad.ciudadanos.length;
    }else{
        felicidadPromedio=-1;
    }

    return felicidadPromedio;
}

function verificarEmpleosDisponibles(ciudad){
let empleosDisponibles=0;
for(let i=0;i<ciudad.edificios.length;i++){
    const edificio=ciudad.edificios[i];

    if(edificio._ciudadanosEmpleados){
        empleosDisponibles+=edificio._capacidadMaxima-edificio._ciudadanosEmpleados.length;

    }
    if(empleosDisponibles>0){
        return true;
    }
    
}

return false;
}

function asignarViviendas(ciudad){

    for(let i = 0; i < ciudad.ciudadanos.length; i++){

        const ciudadano = ciudad.ciudadanos[i];

        if(ciudadano._vivienda){
            continue;
        }

        for(let j = 0; j < ciudad.edificios.length; j++){

            const edificio = ciudad.edificios[j];

            if(edificio._tipo === "Casa" || edificio._tipo === "Apartamento"){

                const agregado = edificio.agregarResidente(ciudadano);

                if(agregado){
                    break;
                }

            }

        }

    }

}

function asignarEmpleos(ciudad){

    for(let i = 0; i < ciudad.ciudadanos.length; i++){

        const ciudadano = ciudad.ciudadanos[i];

        if(ciudadano._empleo){
            continue;
        }

        for(let j = 0; j < ciudad.edificios.length; j++){

            const edificio = ciudad.edificios[j];

            if(edificio._ciudadanosEmpleados){

                const agregado = edificio.agregarEmpleado(ciudadano);

                if(agregado){
                    break;
                }

            }

        }

    }

}

function actualizarFelicidadGeneral(ciudad){

    for(let i=0;i<ciudad.ciudadanos.length;i++){
        const ciudadano=ciudad.ciudadanos[i];

        ciudadano.actualizarFelicidadIndividual(ciudad);
    }
    
}

function actualizarPuntaje(){
    //falta hacer el archivo puntuacion y esto para que se actualice
}
