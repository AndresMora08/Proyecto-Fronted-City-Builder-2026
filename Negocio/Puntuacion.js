function calcularPuntuacion(ciudad, produccion, consumo){

    const score = (ciudad.poblacion * 10) 
    + (felicidadPromedioCondicion(ciudad) * 5) 
    + (ciudad.dinero / 100) 
    + (ciudad.edificios.length * 50) 
    + (balanceElectricidad(produccion, consumo) * 2) 
    + (balanceAgua(produccion, consumo) * 2)
    + bonificaciones(ciudad) 
    + penalizaciones(ciudad);

    return score;
}

function felicidadPromedioCondicion(ciudad){
 let  felicidadPromedio=calcularFelicidadPromedio(ciudad); 
    if(felicidadPromedio===-1){
         felicidadPromedio=0; 
    }
     return felicidadPromedio; }

function bonificaciones(ciudad){

    let bonificacionTodosEmpleados = 500;

    for(let i = 0; i < ciudad.ciudadanos.length; i++){
        const ciudadano = ciudad.ciudadanos[i];

        if(ciudadano.empleo === null){
            bonificacionTodosEmpleados = 0;
            break;
        }
    }

    let beneficioFelicidadPromedio = 0;
    const felicidadPromedio = calcularFelicidadPromedio(ciudad);
    if(felicidadPromedio > 80){
        beneficioFelicidadPromedio = 300;
    }

    let beneficioPorRecursos = 0;
    if(ciudad.agua > 0 && ciudad.electricidad > 0 && ciudad.alimento > 0){
        beneficioPorRecursos = 200;
    }

    let beneficioPorPoblacion = 0;
    if(ciudad.poblacion > 1000){
        beneficioPorPoblacion = 1000;
    }

    return bonificacionTodosEmpleados 
         + beneficioFelicidadPromedio 
         + beneficioPorRecursos 
         + beneficioPorPoblacion;
}

function penalizaciones(ciudad){

    let penalizacionDinero = 0;
    if(ciudad.dinero < 0){
        penalizacionDinero = -500;
    }

    let penalizacionElectricidad = 0;
    if(ciudad.electricidad < 0){
        penalizacionElectricidad = -300;
    }

    let penalizacionAgua = 0;
    if(ciudad.agua < 0){
        penalizacionAgua = -300;
    }

    let penalizacionFelicidad = 0;
    const felicidadPromedio = calcularFelicidadPromedio(ciudad);
    if(felicidadPromedio !== -1 && felicidadPromedio < 40){
        penalizacionFelicidad = -400;
    }

    let penalizacionDesempleo = 0;
    for(let i = 0; i < ciudad.ciudadanos.length; i++){
        const ciudadano = ciudad.ciudadanos[i];
        if(ciudadano.empleo === null){
            penalizacionDesempleo += -10;
        }
    }

    return penalizacionDinero 
         + penalizacionElectricidad 
         + penalizacionAgua 
         + penalizacionFelicidad 
         + penalizacionDesempleo;
}


