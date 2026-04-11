let tiempoTurno = 50000; 



const tiempoGuardado = localStorage.getItem("tiempoTurno");

if (tiempoGuardado !== null) {
    tiempoTurno = Number(tiempoGuardado);
}

let maximoCiudadanos = 3;
let minimoCiudadanos = 1;

let idTurno = null;
let proximoTurnoEn = null;
let inicioTurnoEn = null;

// Consumo por ciudadano (configurable)
let CONSUMO_CIUDADANO = {
    electricidad: 1,
    agua: 1,
    alimento: 1
};

// ===============================
// INICIO DEL SISTEMA
// ===============================
function iniciarSistemaTurnos() {
    programarProximoTurno();
}

function cambiarTiempoTurno(nuevoTiempo) {
    tiempoTurno = nuevoTiempo;
     localStorage.setItem("tiempoTurno", nuevoTiempo);

    
    detenerTurnos();
    programarProximoTurno();
}

function cambiarRangoCreacion(nuevoMaximo, nuevoMinimo){
    if(nuevoMaximo !== undefined && nuevoMinimo !== undefined){
        if(nuevoMaximo >= nuevoMinimo && nuevoMinimo >= 0){
            maximoCiudadanos = nuevoMaximo;
            minimoCiudadanos = nuevoMinimo;
            return true;
        }
    }
    return false;
}

function cambiarConsumoCiudadano(nuevoConsumo){
    if(!nuevoConsumo) return false;

    if(nuevoConsumo.electricidad >= 0){
        CONSUMO_CIUDADANO.electricidad = nuevoConsumo.electricidad;
    }

    if(nuevoConsumo.agua >= 0){
        CONSUMO_CIUDADANO.agua = nuevoConsumo.agua;
    }

    if(nuevoConsumo.alimento >= 0){
        CONSUMO_CIUDADANO.alimento = nuevoConsumo.alimento;
    }

    return true;
}

// ===============================
// TURNOS
// ===============================
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

// ===============================
// EJECUCIÓN DEL TURNO
// ===============================
function ejecutarTurno(ciudad){
    ciudad.turno++;
    const produccion = calcularProduccion(ciudad);
    const consumo = calcularConsumo(ciudad);

    const sigue=aplicarBalance(ciudad, produccion, consumo);
    if(!sigue){
        return
    }

    actualizarFelicidadGeneral(ciudad);

    creacionNuevosCiudadanos(ciudad, maximoCiudadanos, minimoCiudadanos);
    ciudad.felicidadPromedio = calcularFelicidadPromedio(ciudad);
    const score = calcularPuntuacion(ciudad, produccion, consumo);
    ciudad.puntuacion += score;

    CiudadStorage.guardar(ciudad);
    mostrarDatosCiudad(ciudad);
    console.log(ciudad.ciudadanos)
    
}

// ===============================
// PRODUCCIÓN
// ===============================
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

            if(edificio.tipo === "Fabrica"){
                produccion.dinero += edificio.produccion;
            }

            if(edificio.tipo === "Planta electrica"){
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

// ===============================
// CONSUMO
// ===============================
function calcularConsumo(ciudad){

    let consumo = {
        electricidad: 0,
        agua: 0,
        alimento: 0
    };

    for(let i = 0; i < ciudad.edificios.length; i++){

        const edificio = ciudad.edificios[i];

        consumo.electricidad += edificio.consumoElectricidad || 0;
        consumo.agua += edificio.consumoAgua || 0;
    }

    const poblacion = ciudad.poblacion;

    consumo.electricidad += poblacion * CONSUMO_CIUDADANO.electricidad;
    consumo.agua += poblacion * CONSUMO_CIUDADANO.agua;
    consumo.alimento += poblacion * CONSUMO_CIUDADANO.alimento;

    return consumo;
}

// ===============================
// BALANCES
// ===============================
function balanceElectricidad(produccion, consumo){
    return produccion.electricidad - consumo.electricidad;
}

function balanceAgua(produccion, consumo){
    return produccion.agua - consumo.agua;
}

function balanceDinero(produccion){
    return produccion.dinero;
}

function balanceAlimento(produccion, consumo){
    return produccion.alimento - consumo.alimento;
}

function balanceMantenimiento(ciudad){

    let costoMantenimiento = 0;

    for(let i = 0; i < ciudad.edificios.length; i++){

        const edificio = ciudad.edificios[i];

        if(edificio.costo){
            costoMantenimiento += edificio.costo * 0.0001;
        }
    }

    return costoMantenimiento;
}

// ===============================
// APLICAR BALANCE
// ===============================
function aplicarBalance(ciudad, produccion, consumo){

    ciudad.dinero += balanceDinero(produccion);
    ciudad.electricidad += balanceElectricidad(produccion, consumo);
    ciudad.agua += balanceAgua(produccion, consumo);
    ciudad.alimento += balanceAlimento(produccion, consumo);

    const mantenimiento = balanceMantenimiento(ciudad);
    ciudad.dinero -= mantenimiento;

    if(
        ciudad.dinero < 0 ||
        ciudad.electricidad < 0 ||
        ciudad.agua < 0 ||
        ciudad.alimento < 0
    ){
        UiMensajes.mostrarMensaje("Tu ciudad ha colapsado por falta de recursos. El juego ha terminado.", 8000);
       eliminarCiudad(ciudad);
        return false;

    }
    return true;
}

// ===============================
// CREACIÓN DE CIUDADANOS
// ===============================
function creacionNuevosCiudadanos(ciudad, maximoCiudadanos, minimoCiudadanos){

    const capacidadResidencial = calcularCapacidad(ciudad);
    const felicidadPromedio = calcularFelicidadPromedio(ciudad);
    const empleosDisponibles = verificarEmpleosDisponibles(ciudad);

    if(capacidadResidencial > ciudad.poblacion && (felicidadPromedio > 60 || felicidadPromedio === -1) && empleosDisponibles){
       
        const Random = Math.floor(Math.random() * (maximoCiudadanos - minimoCiudadanos + 1) + minimoCiudadanos);

        for(let i = 0; i < Random; i++){

            const ciudadanoCreado = Ciudadano.crearCiudadano();
            ciudad.ciudadanos.push(ciudadanoCreado);
            ciudad.poblacion++;
        }

        asignarViviendas(ciudad);
        asignarEmpleos(ciudad);
    }
}

// ===============================
// RESTO DE FUNCIONES (SIN CAMBIOS)
// ===============================
function calcularCapacidad(ciudad){
    let capacidadResidencial = 0;

    for(let i = 0; i < ciudad.edificios.length; i++){
        const edificio = ciudad.edificios[i];
        if(edificio.tipo === "Casa" || edificio.tipo === "Apartamento"){
            capacidadResidencial += edificio.capacidadMaxima;
        }
    }

    return capacidadResidencial;
}

function calcularFelicidadPromedio(ciudad){
    let felicidadTotal = 0;

    if(ciudad.ciudadanos.length > 0){
        for(let ciudadano of ciudad.ciudadanos){
            felicidadTotal += ciudadano.nivelFelicidad;
        }
        return felicidadTotal / ciudad.ciudadanos.length;
    }

    return -1;
}

function verificarEmpleosDisponibles(ciudad){
    let empleosDisponibles = 0;

    for(let edificio of ciudad.edificios){

        if(edificio.ciudadanosEmpleados){
            empleosDisponibles += edificio.capacidadMaxima - edificio.ciudadanosEmpleados.length;
        }

        if(empleosDisponibles > 0){
            return true;
        }
    }

    return false;
}

function asignarViviendas(ciudad){
    for(let ciudadano of ciudad.ciudadanos){

        if(ciudadano.vivienda) continue;

        for(let edificio of ciudad.edificios){

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
    for(let ciudadano of ciudad.ciudadanos){

        if(ciudadano.empleo) continue;

        for(let edificio of ciudad.edificios){

            if(edificio.ciudadanosEmpleados && typeof edificio.agregarEmpleado === "function"){

                const agregado = edificio.agregarEmpleado(ciudadano);

                if(agregado){
                    break;
                }
            }
        }
    }
}

function actualizarFelicidadGeneral(ciudad){
    if(ciudad.ciudadanos.length === 0) return;

    for(let ciudadano of ciudad.ciudadanos){
        ciudadano.actualizarFelicidadIndividual(ciudad);
    }
}