document.addEventListener("DOMContentLoaded", inicializarJuego);

async function inicializarJuego() {
    intentarBloqueoOrientacionMovil();
    configurarAlertaOrientacionMovil();

    const ciudad = cargarCiudad();
    if (!ciudad) return;

    if (window.TamanosEdificios && typeof TamanosEdificios.sincronizarMatriz === "function") {
        TamanosEdificios.sincronizarMatriz(ciudad);
    }

    mostrarDatosCiudad(ciudad);
    UIMapa.renderizarMapa(ciudad);
    configurarMenus();

    // --- CLIMA ---
    // Primera carga inmediata
    gestionarActualizacionClima(ciudad);

    // Configurar el intervalo de 30 minutos
    setInterval(() => {
        gestionarActualizacionClima(ciudad);
    }, 1800000); // 1,800,000 ms = 30 minutos
}

// Nueva función de apoyo para no repetir código
async function gestionarActualizacionClima(ciudad) {
    const lat = Number(ciudad.latitud);
    const lon = Number(ciudad.longitud);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        // Intentar reconstruir coordenadas desde el nombre de la ciudad (para partidas antiguas)
        if (typeof obtenerCoordenadasCiudad === "function") {
            const coords = await obtenerCoordenadasCiudad(ciudad.nombreCiudad, ciudad.region || "");
            if (coords) {
                ciudad.latitud = coords.lat;
                ciudad.longitud = coords.lon;
                if (window.CiudadStorage && typeof CiudadStorage.guardar === "function") {
                    CiudadStorage.guardar(ciudad);
                }
            } else {
                console.warn("No se pudieron obtener coordenadas para clima.");
                return;
            }
        } else {
            return;
        }
    }

    console.log("Actualizando clima real...");
    const datosClima = await obtenerClima(ciudad.latitud, ciudad.longitud);
    if (datosClima) {
        actualizarUIClima(datosClima);
    }
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
        btnVias: document.getElementById('btnVias')
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
    });
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

    btns.btnVias?.addEventListener('click', () => {
        menuAnterior = 'construir';
        mostrarSolo('vias');
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
            UIAlertas.alertaOrientacionMovil();
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
        UIAlertas.alertaSinPartida();
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
