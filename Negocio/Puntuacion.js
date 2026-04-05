  let datosPuntuacionGlobal = null;
  
  function calcularPuntuacion(ciudad, produccion, consumo){
  const datosPuntuacion = {
        poblacion:(ciudad.poblacion*10),
        felicidad:(felicidadPromedioCondicion(ciudad)*5),
        dinero:(ciudad.dinero/100),
        edificios:(ciudad.edificios.length*50),
        balanceElectricidad:(balanceElectricidad(produccion, consumo)*2),
        balanceAgua:(balanceAgua(produccion, consumo)*2),
        bonificaciones:bonificaciones(ciudad),
        penalizaciones:penalizaciones(ciudad)
        
    }
    datosPuntuacionGlobal = datosPuntuacion; // Guardamos los datos para el desglose en variable global igual a datosPuntuacion
    return obtenerPuntuacion(datosPuntuacion);
  }


  function obtenerPuntuacion(datosPuntuacion){

    const score = datosPuntuacion.poblacion
                + datosPuntuacion.felicidad
                + datosPuntuacion.dinero
                + datosPuntuacion.edificios
                + datosPuntuacion.balanceElectricidad
                + datosPuntuacion.balanceAgua
                + datosPuntuacion.bonificaciones
                + datosPuntuacion.penalizaciones;

    return score;
}
function desglosePuntuacion(datosPuntuacion){//esta funcion servira para una parte del documento que pide que al darle clikc a la puntucacion de muestre puntuacion por estadisticas especificas
    const contenedor = document.getElementById("contenedorDatos");
    if(!contenedor) return;

  
    contenedor.innerHTML = `
    <table border="1">
        <tr>
            <th>Concepto</th>
            <th>Puntos del turno</th>
        </tr>
        <tr>
            <td>Puntos por población</td>
            <td>${datosPuntuacion.poblacion}</td>
        </tr>
        <tr>
            <td>Puntos por felicidad</td>
            <td>${datosPuntuacion.felicidad}</td>
        </tr>
        <tr>
            <td>Puntos por dinero</td>
            <td>${datosPuntuacion.dinero}</td>
        </tr>
        <tr>
            <td>Puntos por edificios</td>
            <td>${datosPuntuacion.edificios}</td>
        </tr>
        <tr>
            <td>Puntos por balance de electricidad</td>
            <td>${datosPuntuacion.balanceElectricidad}</td>
        </tr>
        <tr>
            <td>Puntos por balance de agua</td>
            <td>${datosPuntuacion.balanceAgua}</td>
        </tr>
        <tr>
            <td>Bonificaciones</td>
            <td>${datosPuntuacion.bonificaciones}</td>
        </tr>
        <tr>
            <td>Penalizaciones</td>
            <td>${datosPuntuacion.penalizaciones}</td>
        </tr>
        <tr>
            <td><strong>Total</strong></td>
            <td><strong>${Object.values(datosPuntuacion).reduce((a,b)=>a+b,0)}</strong></td>
        </tr>
    </table>`;
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


