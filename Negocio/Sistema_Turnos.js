
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

        if(edificio.ingresos){
            
            produccion.dinero += edificio.ingresos;
        }

        if(edificio.produccion){
            if(edificio.tipo==="Fabrica"){
                 produccion.dinero+=edificio.produccion
             }

            if(edificio.tipo === "Planta Electrica"){
                produccion.electricidad += edificio.produccion;
            }

            if(edificio.tipo === "Planta de agua"){
                produccion.agua += edificio.produccion;
            }

            if(edificio.tipo === "Granja"){
                produccion.alimento += edificio.produccion;
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

        consumo.electricidad += edificio.consumoElectricidad;
        consumo.agua += edificio.consumoAgua;

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
         if(edificio.tipo==="Casa"||edificio.tipo==="Apartamento"){
            capacidadResidencial+=edificio.capacidadMaxima;
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
            felicidadTotal+=ciudadano.nivelFelicidad;
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

    if(edificio.ciudadanosEmpleados){
        empleosDisponibles+=edificio.capacidadMaxima-edificio.ciudadanosEmpleados.length;

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

        if(ciudadano.vivienda){
            continue;
        }

        for(let j = 0; j < ciudad.edificios.length; j++){

            const edificio = ciudad.edificios[j];

            if(edificio.tipo === "Casa" || edificio.tipo === "Apartamento"){

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

        if(ciudadano.empleo){
            continue;
        }

        for(let j = 0; j < ciudad.edificios.length; j++){

            const edificio = ciudad.edificios[j];

            if(edificio.ciudadanosEmpleados){

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