let ciudad = null;

document.addEventListener("DOMContentLoaded", inicializarJuego);

async function inicializarJuego() {
    intentarBloqueoOrientacionMovil();
    configurarAlertaOrientacionMovil();

    ciudad = cargarCiudad();
    console.log("Ciudad cargada:", ciudad);
    if (!ciudad) return;

    if (window.TamanosEdificios && typeof TamanosEdificios.sincronizarMatriz === "function") {
        TamanosEdificios.sincronizarMatriz(ciudad);
    }

    mostrarDatosCiudad(ciudad);
    UIMapa.renderizarMapa(ciudad);
    configurarMenus();
    configurarBotonConfig();
    

    iniciarSistemaTurnos();

    // CLIMA 

    gestionarActualizacionClima(ciudad);

    // 30 min
    setInterval(() => {
        gestionarActualizacionClima(ciudad);
    }, 1800000); 
}

// Nueva función de apoyo para no repetir código
async function gestionarActualizacionClima(ciudad) {
    const lat = Number(ciudad.latitud);
    const lon = Number(ciudad.longitud);

    const coordsInvalidas = !Number.isFinite(lat) || !Number.isFinite(lon) || (lat === 0 && lon === 0);
    if (coordsInvalidas) {
        // Intentar reconstruir coordenadas desde la region real (para partidas antiguas o nombres ficticios)
        if (typeof obtenerCoordenadasCiudad === "function") {
            const consulta = ciudad.region || ciudad.nombreCiudad;
            const coords = await obtenerCoordenadasCiudad(consulta, "");
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


    ocultarTodo();
    if (huds.acciones) huds.acciones.classList.remove('hidden');

    // EVENTOS

    btns.abrirConstruir?.addEventListener('click', () => {
        menuAnterior = 'acciones';
        mostrarSolo('construir');
    });

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

function configurarBotonConfig() {
    const btnConfig = document.getElementById("btnConfig");
    if (!btnConfig) return;

    // Input oculto para cargar mapas desde .txt
    let inputArchivo = document.getElementById("inputMapaTxt");
    if (!inputArchivo) {
        inputArchivo = document.createElement("input");
        inputArchivo.type = "file";
        inputArchivo.accept = ".txt";
        inputArchivo.id = "inputMapaTxt";
        inputArchivo.style.display = "none";
        document.body.appendChild(inputArchivo);
    }

    const leerArchivoTexto = (archivo) => {
        return new Promise((resolve, reject) => {
            const lector = new FileReader();
            lector.onload = () => resolve(String(lector.result || ""));
            lector.onerror = () => reject(lector.error || new Error("Error al leer archivo"));
            lector.readAsText(archivo);
        });
    };

    btnConfig.addEventListener("click", () => {
        if (inputArchivo) {
            inputArchivo.value = "";
            inputArchivo.click();
        }
    });

    inputArchivo.addEventListener("change", async () => {
        const archivo = inputArchivo.files && inputArchivo.files[0];
        if (!archivo) return;

        if (!archivo.name.toLowerCase().endsWith(".txt")) {
            if (window.UIAlertas && typeof UIAlertas.alertaCamposIncompletos === "function") {
                UIAlertas.alertaCamposIncompletos();
            } else {
                alert("El archivo debe ser .txt");
            }
            return;
        }

        try {
            const contenido = await leerArchivoTexto(archivo);
            if (typeof window.importarMapaDesdeTxt === "function") {
                window.importarMapaDesdeTxt(contenido, archivo.name);
            } else if (window.UIMensajes && typeof UIMensajes.mostrarMensaje === "function") {
                UIMensajes.mostrarMensaje("Archivo cargado. Importador pendiente de implementar.", 4000);
            }
        } catch (error) {
            console.error("Error leyendo el archivo:", error);
            if (window.UIMensajes && typeof UIMensajes.mostrarMensaje === "function") {
                UIMensajes.mostrarMensaje("No se pudo leer el archivo.", 4000);
            }
        }
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
