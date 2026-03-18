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
function configurarMenus() {
    //huds
    const huds = {
        acciones: document.getElementById('hudAcciones'),
        construir: document.getElementById('hudConstruir'),
        edificios: document.getElementById('hudConstruirEdificios'),
            residencias: document.getElementById('hudResidencias'),
            comercios: document.getElementById('hudComercios'),
            industrias: document.getElementById('hudIndustrias'),
            servicios: document.getElementById('hudServicios'),
            utilidades: document.getElementById('hudUtilidades'),
        vias: document.getElementById('hudConstruirVias'),
        parques: document.getElementById('hudConstruirParques'),
        
    };

    //botones
    const btns = {
        abrirConstruir: document.getElementById('btnConstruir'),
        btnEdificios: document.getElementById('btnEdificios'),
            btnResidencias: document.getElementById('btnResidencias'),
            btnComercios: document.getElementById('btnComercios'),
            btnIndustrias: document.getElementById('btnIndustrias'),
            btnServicios: document.getElementById('btnServicios'),
            btnUtilidades: document.getElementById('btnUtilidades'),
        btnVias: document.getElementById('btnVias'),
        btnParques: document.getElementById('btnParques')
    };

    const botonesVolver = document.querySelectorAll('.btn-volver');
    let menuAnterior = null;

    //ocultar menús
    function ocultarTodo() {
        Object.values(huds).forEach(hud => {
            if (hud) hud.classList.add('hidden');
        });
    }

    function mostrarSolo(nombreHud) {
        ocultarTodo();
        const hud = huds[nombreHud];
        if (hud) hud.classList.remove('hidden');
    }

    // --- ESTADO INICIAL ---
    // Ocultamos todos menos el de acciones al empezar
    ocultarTodo();
    if (huds.acciones) huds.acciones.classList.remove('hidden');

    // --- EVENTOS ---

    // Principal -> Menú Construir
    btns.abrirConstruir?.addEventListener('click', () => {
        menuAnterior = 'acciones';
        mostrarSolo('construir');
    });

    // Menú Construir -> Submenús
    btns.btnEdificios?.addEventListener('click', () => {
        menuAnterior = 'construir';
        mostrarSolo('edificios');

        btns.btnResidencias?.addEventListener('click', () => {
            menuAnterior = 'edificios'
            mostrarSolo('residencias');
        }); 
        btns.btnComercios?.addEventListener('click', () => {
            menuAnterior = 'edificios'
            mostrarSolo('comercios');
        });
         btns.btnIndustrias?.addEventListener('click', () => {
            menuAnterior = 'edificios'
            mostrarSolo('industrias');
        });
         btns.btnServicios?.addEventListener('click', () => {
            menuAnterior = 'edificios'
            mostrarSolo('servicios');
        });
         btns.btnUtilidades?.addEventListener('click', () => {
            menuAnterior = 'edificios'
            mostrarSolo('utilidades');
        });
    });

    btns.btnVias?.addEventListener('click', () => {
        menuAnterior = 'construir';
        mostrarSolo('vias');
    });

    btns.btnParques?.addEventListener('click', () => {
        menuAnterior = 'construir';
        mostrarSolo('parques');
    });

    // Botón Volver
    botonesVolver.forEach((btn) => {
        btn.addEventListener('click', () => {
            const destino = btn.dataset.back;
            if (destino && huds[destino]) {
                mostrarSolo(destino);
                menuAnterior = null;
                return;
            }

            if (menuAnterior && huds[menuAnterior]) {
                mostrarSolo(menuAnterior);
                menuAnterior = null;
                return;
            }

            mostrarSolo('acciones');
        });
    });
}


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