let modalidad="ninguna";
let tipoElegido;
document.addEventListener("DOMContentLoaded", function() {
    const ciudad=cargarCiudad();
    const hudAcciones = document.getElementById("hudAcciones");
    const hudDinamico = document.getElementById("hudDinamico");
    const btnConstruir = document.getElementById("btnConstruir");

    if (!hudAcciones || !hudDinamico || !btnConstruir) {
        return;
    }
   
    
    //const btnDemoler=document.getElementById("btnDemoler");

    btnConstruir.addEventListener("click", function() {
         hudAcciones.style.display = "none";
        hudDinamico.style.display = "flex";
        mostrarMenuConstruccion();
    });

    btnDemoler.addEventListener("click", function(){

        hudAcciones.style.display="none";
        hudDinamico.style.display="flex";
        mostrarMenuDemolicion();
    });

    // Menú principal de construcción
    function mostrarMenuConstruccion() {
       
        hudDinamico.innerHTML = `
            <button id="btnResiden"></button>
            <button id="btnComer"></button>
            <button id="btnIndus"></button>
            <button id="btnServ"></button>
            <button id="btnUtili"></button>
            <button id="btnParque"></button>
            <button id="btnVia"></button>
            <button id="btnVolver">⬅</button>
        `;

        document.getElementById("btnResiden").addEventListener("click", mostrarMenuResidencial);
        document.getElementById("btnComer").addEventListener("click", mostrarMenuComercial);
        document.getElementById("btnIndus").addEventListener("click", mostrarMenuIndustrial);
        document.getElementById("btnServ").addEventListener("click", mostrarMenuServicio);
        document.getElementById("btnUtili").addEventListener("click", mostrarMenuUtilidad);
        document.getElementById("btnParque").addEventListener("click", mostrarMenuParque);
        document.getElementById("btnVia").addEventListener("click", mostrarMenuVia);

        document.getElementById("btnVolver").addEventListener("click", volver);
    }
    function volver(){
        hudDinamico.innerHTML = "";
            hudDinamico.style.display = "none";
            hudAcciones.style.display = "flex";
    }

    // Residencial
    function mostrarMenuResidencial() {
        hudDinamico.innerHTML = `
            <button data-tipo="R1">Casa</button>
            <button data-tipo="R2">Apartamento</button>
            <button id="btnVolver">⬅</button>
        `;

        agregarListenerVolver();
        agregarListenerTipo();
    }

    // Comercial
    function mostrarMenuComercial() {
        hudDinamico.innerHTML = `
            <button data-tipo="C1">Tienda</button>
            <button data-tipo="C2">Centro Comercial</button>
            <button id="btnVolver">⬅</button>
        `;

        agregarListenerVolver();
        agregarListenerTipo();
    }

    // Industrial
    function mostrarMenuIndustrial() {
        hudDinamico.innerHTML = `
            <button data-tipo="I1">Fábrica</button>
            <button data-tipo="I2">Granja</button>
            <button id="btnVolver">⬅</button>
        `;

        agregarListenerVolver();
        agregarListenerTipo();
    }

    // Servicios
    function mostrarMenuServicio() {
        hudDinamico.innerHTML = `
            <button data-tipo="S1">Policía</button>
            <button data-tipo="S2">Bomberos</button>
            <button data-tipo="S3">Hospital</button>
            <button id="btnVolver">⬅</button>
        `;

        agregarListenerVolver();
        agregarListenerTipo();
    }

    // Utilidades
    function mostrarMenuUtilidad() {
        hudDinamico.innerHTML = `
            <button data-tipo="U1">Planta Eléctrica</button>
            <button data-tipo="U2">Planta Agua</button>
            <button id="btnVolver">⬅</button>
        `;

        agregarListenerVolver();
        agregarListenerTipo();
    }

    // Parque
    function mostrarMenuParque() {
        hudDinamico.innerHTML = `
            <button data-tipo="P1">Parque</button>
            <button id="btnVolver">⬅</button>
        `;

        agregarListenerVolver();
        agregarListenerTipo();
    }

    function mostrarMenuVia(){
        hudDinamico.innerHTML = `
            <button data-tipo="r">Carretera</button>
            <button id="btnVolver">⬅</button>
        `;

        agregarListenerVolver();
        agregarListenerTipo();
    }

    function agregarListenerVolver() {
        const btnVolver = document.getElementById("btnVolver");

        btnVolver.addEventListener("click", function() {
            hudDinamico.innerHTML = "";
            mostrarMenuConstruccion();
        });
    }

    function agregarListenerTipo() {
        hudDinamico.addEventListener("click", function listener(e) {

            if (e.target.dataset.tipo) {
                document.getElementById("mapaContainer").classList.add("modo-construccion");
                tipoElegido = e.target.dataset.tipo;
                modalidad="construccion";
                
                hudDinamico.removeEventListener("click", listener);
            }

        });
    }

});
 function mostrarMenuDemolicion(){

        hudDinamico.innerHTML=`
        <p > seleccione el edificio o via a demoler con un click sobre ellos</p>
        <button id="btnVolver">⬅</button>
        `;
         document.getElementById("btnVolver").addEventListener("click", volver);
        modalidad="demolicion";
    }

    const mapaContainer=document.getElementById("mapaContainer");
mapaContainer.addEventListener("click", function(e){

    const casilla = e.target.closest(".casilla");

    if(!casilla) return;

    const x = parseInt(casilla.dataset.x);
    const y = parseInt(casilla.dataset.y);

    if(modalidad==="construccion"){
        modalidadConstruccion(ciudad,x,y,tipoElegido);
    }
    else if(modalidad==="demolicion"){
        modalidadDemolicion(ciudad,x,y);
    }

});



  

