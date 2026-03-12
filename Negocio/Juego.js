document.addEventListener("DOMContentLoaded", inicializarJuego);



function inicializarJuego() {
    intentarBloqueoOrientacionMovil();
    configurarAlertaOrientacionMovil();

    const ciudad = cargarCiudad();

    if (!ciudad) return;

    mostrarDatosCiudad(ciudad);
    renderizarMapa(ciudad);
    
}

// FUNCIÓN DE MENUS PARA EL HUD

function intentarBloqueoOrientacionMovil() {
    const esMovil = /Android|iPhone|iPod/i.test(navigator.userAgent);

    if (!esMovil) return;
    if (!screen.orientation || typeof screen.orientation.lock !== "function") return;

    screen.orientation.lock("portrait").catch(() => {
    });
}

function configurarAlertaOrientacionMovil() {
    const esMovil = /Android|iPhone|iPod/i.test(navigator.userAgent);

    if (!esMovil) return;

    let alertaMostradaEnHorizontal = false;

    const validarOrientacion = () => {
        const estaHorizontal = window.matchMedia("(orientation: landscape)").matches;

        if (estaHorizontal && !alertaMostradaEnHorizontal) {
            alert("Para jugar, gira tu dispositivo a orientacion vertical.");
            alertaMostradaEnHorizontal = true;
            return;
        }

        if (!estaHorizontal) {
            alertaMostradaEnHorizontal = false;
        }
    };

    window.addEventListener("orientationchange", validarOrientacion);
    window.addEventListener("resize", validarOrientacion);
    validarOrientacion();
}
function cargarCiudad() {
    const ciudad = CiudadStorage.cargar();

    if (!ciudad) {
        alert("No hay partida guardada. Crea una nueva ciudad.");
        window.location.href = "Crear_Ciudad.html";
        return null;
    }

    console.log(ciudad);
    console.log(ciudad?.mapa);

    return ciudad;
}
function mostrarDatosCiudad(ciudad) {
    const nombre = document.getElementById("datosCiudad");
    if (nombre) nombre.textContent = ciudad.nombreCiudad;
    const actualizar = (id, valor) => {
        const el = document.getElementById(id);
        if (el) el.textContent = valor;
    };

    actualizar("Dinero", ciudad.dinero);
    actualizar("Electricidad", ciudad.electricidad);
    actualizar("Agua", ciudad.agua);
    actualizar("Alimento", ciudad.alimento);
    actualizar("Poblacion", ciudad.poblacion); 
}

function renderizarMapa(ciudad) {
    const mapaContainer = document.getElementById("mapaContainer");
    let tablaHTML = "<table>";

    for (let i = 0; i < ciudad.mapa.tamanio; i++) {
        tablaHTML += "<tr>";

        for (let j = 0; j < ciudad.mapa.tamanio; j++) {

            const valor = ciudad.mapa.matriz[i][j];
            const clase = obtenerClaseCelda(valor);

            tablaHTML += 
          `
                <td class="${clase}">
                    <button class="casilla" data-x="${i}" data-y="${j}" ></button>
                </td>
            `;
        }

        tablaHTML += "</tr>";
    }

    tablaHTML += "</table>";
    mapaContainer.innerHTML = tablaHTML;
    

    
}


function obtenerClaseCelda(valor) {

   if (valor === "g") return "pasto";

if (valor === "r") return "via";

if (valor === "R1") return "casa";

if (valor === "R2") return "apartamento";

if (valor === "C1") return "tienda";

if (valor === "C2") return "centro_comercial";

if (valor === "I1") return "fabrica";

if (valor === "I2") return "granja";

if (valor === "S1") return "estacion_policia";

if (valor === "S2") return "estacion_bomberos";

if (valor === "S3") return "hospital";

if (valor === "U1") return "planta_electrica";

if (valor === "U2") return "planta_agua";

if (valor === "P1") return "parque";

return "";

    return "";
}




