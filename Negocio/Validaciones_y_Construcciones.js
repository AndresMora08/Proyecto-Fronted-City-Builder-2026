document.addEventListener("DOMContentLoaded", function() {
    const ciudad = cargarCiudad();

    const casillas=document.getElementsByClassName("casilla");

   
    for (let i = 0; i < casillas.length; i++) {
    casillas[i].addEventListener("click", function () {

        const x = this.dataset.x;
        const y = this.dataset.y;
        if(modo==="construccion"){
        modalidadConstruccion(ciudad,x,y,tipoElegido);
        }
    });
}   
    function modalidadConstruccion(ciudad,x,y,tipoElegido){

       const costo=obtenerCosto(tipoElegido);

       const validacion=validarConstruccion(costo,x,y,ciudad,tipoElegido);

    }   

    function obtenerCosto(tipoElegido){

        

    let costo = 0;

    if (tipoElegido === "r") {
        costo = 100; // vía
    }

    else if (tipoElegido === "R1") {
        costo = 1000; // Casa
    }

    else if (tipoElegido === "R2") {
        costo = 3000; // Apartamento
    }

    else if (tipoElegido === "C1") {
        costo = 2000; // Tienda
    }

    else if (tipoElegido === "C2") {
        costo = 8000; // Centro Comercial
    }

    else if (tipoElegido === "I1") {
        costo = 5000; // Fábrica
    }

    else if (tipoElegido === "I2") {
        costo = 3000; // Granja
    }

    else if (tipoElegido === "S1") {
        costo = 4000; // Estación Policía
    }

    else if (tipoElegido === "S2") {
        costo = 4000; // Estación Bomberos
    }

    else if (tipoElegido === "S3") {
        costo = 6000; // Hospital
    }

    else if (tipoElegido === "U1") {
        costo = 10000; // Planta Eléctrica
    }

    else if (tipoElegido === "U2") {
        costo = 8000; // Planta de Agua
    }

    else if (tipoElegido === "P1") {
        costo = 1500; // Parque
    }

    return costo;
}
   
function validarConstruccion(costo,x,y,ciudad,tipoElegido){

    if(ciudad.mapa.matriz[x][y]!=="g" || ciudad.dinero<costo || !tieneViaAdyacente(x,y,ciudad,tipoElegido)){
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
        [-1, 0], // arriba
        [1, 0],  // abajo
        [0, -1], // izquierda
        [0, 1]   // derecha
    ];

    for (let i = 0; i < direcciones.length; i++) {

        const nuevaX = x + direcciones[i][0];
        const nuevaY = y + direcciones[i][1];

        if (
            nuevaX >= 0 && nuevaY >= 0 &&
            nuevaX < tamaño && nuevaY < tamaño
        ) {
            if (mapa[nuevaX][nuevaY] === "r") {
                return true;
            }
        }
    }

    return false;
}




    
    

   
    
});
