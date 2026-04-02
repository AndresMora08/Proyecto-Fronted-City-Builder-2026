
let tiempoTurno = 50000; // 10 segundos por defecto 3

let idTurno = null;
let proximoTurnoEn = null;
let inicioTurnoEn = null;

// Inicia el sistema de turnos (llamar cuando carga la ciudad)
// Parámetro opcional: tiempo en milisegundos
function iniciarSistemaTurnos() {
    programarProximoTurno();
}

// Cambia el tiempo del turno en cualquier momento
function cambiarTiempoTurno(nuevoTiempo) {
    tiempoTurno = nuevoTiempo;
}

// Programa el próximo turno (se actualiza automáticamente si cambias tiempoTurno)
function programarProximoTurno() {
    const ahora = Date.now();
    inicioTurnoEn = ahora;
    proximoTurnoEn = ahora + tiempoTurno;

    idTurno = setTimeout(() => {
        if (ciudad) {
            ejecutarTurno(ciudad);
            programarProximoTurno();
        }
    }, tiempoTurno);
}

// Detiene los turnos si es necesario
function detenerTurnos() {
    if (idTurno) {
        clearTimeout(idTurno);
        idTurno = null;
    }
}

function obtenerInfoTurno() {
    return {
        tiempoTurno,
        proximoTurnoEn,
        inicioTurnoEn
    };
}

function ejecutarTurno(ciudad){
const produccion=calcularProduccion(ciudad);
const consumo=calcularConsumo(ciudad);
aplicarBalance(ciudad,produccion,consumo);
actualizarFelicidadGeneral(ciudad);
creacionNuevosCiudadanos(ciudad);
const score=calcularPuntuacion(ciudad,produccion,consumo);
ciudad.puntuacion+=score;
CiudadStorage.guardar(ciudad);
mostrarDatosCiudad(ciudad);

console.log("puntuacion:", ciudad.puntuacion);
console.log(ciudad.dinero);
console.log("Ciudadanos creados:", ciudad.ciudadanos);
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

            if(edificio.tipo === "Planta electrica"){
                produccion.electricidad += edificio.produccion;
            }

            if(edificio.tipo === "Planta de agua"){
                produccion.agua += edificio.produccion;
            }

            if(edificio.tipo === "Granja"){
                produccion.alimento += edificio.produccion;
                console.log("Producción alimento:",edificio.tipo, edificio.produccion);
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

function balanceElectricidad(produccion, consumo){
    console.log("Producción electricidad:", produccion.electricidad);
    console.log("Consumo electricidad:", consumo.electricidad);
    return produccion.electricidad - consumo.electricidad;
}

function balanceAgua(produccion, consumo){
    console.log("Producción agua:", produccion.agua);
    console.log("Consumo agua:", consumo.agua);
    return produccion.agua - consumo.agua;
}

function balanceDinero(produccion){
    return produccion.dinero;
}

function balanceAlimento(produccion){
    return produccion.alimento;
}


function aplicarBalance(ciudad, produccion, consumo){

    ciudad.dinero += balanceDinero(produccion);

    ciudad.electricidad += balanceElectricidad(produccion, consumo);

    ciudad.agua += balanceAgua(produccion, consumo);

    ciudad.alimento += balanceAlimento(produccion);
}

function creacionNuevosCiudadanos(ciudad){

    const capacidadResidencial=calcularCapacidad(ciudad);
    const felicidadPromedio=calcularFelicidadPromedio(ciudad);
    const empleosDisponibles=verificarEmpleosDisponibles(ciudad);

    
    if(capacidadResidencial>ciudad.poblacion && (felicidadPromedio>60 || felicidadPromedio===-1) && empleosDisponibles){
       
        const Random=Math.floor(Math.random()*(3)+1);
        for(let i=0;i<Random;i++){

            const ciudadanoCreado=Ciudadano.crearCiudadano();

            ciudad.ciudadanos.push(ciudadanoCreado);
            
            console.log("NUEVO CIUDADANO:", ciudadanoCreado);
            ciudad.poblacion++;


        }
        asignarViviendas(ciudad);
        asignarEmpleos(ciudad);
       
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
    console.log("Felicidad promedio:", felicidadPromedio);
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
                    console.log("Ciudadano", ciudadano.id, "asignado a vivienda en", edificio.nombre);
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

            if(
            edificio.ciudadanosEmpleados &&
             typeof edificio.agregarEmpleado === "function"
             ){

                const agregado = edificio.agregarEmpleado(ciudadano);

                if(agregado){
                    console.log("Ciudadano", ciudadano.id, "asignado a empleo en", edificio.nombre);
                    break;
                }

            }

        }

    }

}

function actualizarFelicidadGeneral(ciudad){
 if(ciudad.ciudadanos.length===0){
    return;
 }
    for(let i=0;i<ciudad.ciudadanos.length;i++){
        const ciudadano=ciudad.ciudadanos[i];

        ciudadano.actualizarFelicidadIndividual(ciudad);
        
    }
    
}
