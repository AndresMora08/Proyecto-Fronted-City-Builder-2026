let modalidad = "ninguna";
let tipoElegido = null;


document.addEventListener("DOMContentLoaded", function() {
    
    

    const mapaContainer = document.getElementById("mapaContainer");
    const estadoRuta = {
        origen: null,
        destino: null,
        esperando: false,
        solicitudId: 0
    };

    const limpiarEstadoRuta = (limpiarRuta = true) => {
        estadoRuta.origen = null;
        estadoRuta.destino = null;
        estadoRuta.esperando = false;
        estadoRuta.solicitudId = 0;
        if (window.UiRuta) {
            UiRuta.limpiarSeleccion();
            if (limpiarRuta) UiRuta.limpiarRuta();
            UiRuta.ocultarLoader();
        }
    };

    const activarModoRuta = () => {
        modalidad = "ruta";
        tipoElegido = null;
        if (mapaContainer) mapaContainer.classList.remove("modo-construccion");
        limpiarEstadoRuta(true);
        UIMensajes.mostrarMensaje("Selecciona el edificio de origen.", 4000);
    };

    const cancelarModoRuta = () => {
        modalidad = "ninguna";
        limpiarEstadoRuta(true);
        UIMensajes.mostrarMensaje("Ruta cancelada.", 2000);
    };

    const esViaCodigo = (codigo) => codigo === "r" || codigo === "r1" || codigo === "r2";

    const esEdificioSeleccionable = (ciudad, x, y) => {
        const fila = ciudad?.mapa?.matriz?.[x];
        const codigo = fila ? fila[y] : null;
        if (!codigo) return false;
        if (codigo === "g" || codigo === "o") return false;
        if (esViaCodigo(codigo)) return false;
        return true;
    };

    const construirMatrizTransitable = (ciudad) => {
        const matriz = ciudad?.mapa?.matriz || [];
        return matriz.map((fila) =>
            fila.map((celda) => (esViaCodigo(celda) ? 1 : 0))
        );
    };

    const normalizarRutaRespuesta = (data) => {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.route)) return data.route;
        if (data && Array.isArray(data.ruta)) return data.ruta;
        if (data && Array.isArray(data.path)) return data.path;
        return null;
    };

    const solicitarRuta = async () => {
        if (typeof calcularRuta !== "function") {
            UIMensajes.mostrarMensaje("Servicio de rutas no disponible.", 4000);
            return;
        }

        const matriz = construirMatrizTransitable(ciudad);
        if (window.UiRuta) UiRuta.limpiarRuta();

        if (window.UiRuta) UiRuta.mostrarLoader("Calculando ruta...");
        estadoRuta.esperando = true;
        const solicitudId = Date.now();
        estadoRuta.solicitudId = solicitudId;

        try {
            const data = await calcularRuta(matriz, estadoRuta.origen, estadoRuta.destino);
            estadoRuta.esperando = false;
            if (window.UiRuta) UiRuta.ocultarLoader();

            if (estadoRuta.solicitudId !== solicitudId) return;
            if (modalidad !== "ruta" || !estadoRuta.origen || !estadoRuta.destino) return;

            const ruta = normalizarRutaRespuesta(data);
            if (!ruta || ruta.length === 0) {
                UIMensajes.mostrarMensaje("No hay ruta disponible entre estos edificios", 5000);
                return;
            }

            if (window.UiRuta) UiRuta.animarRuta(ruta);
        } catch (error) {
            estadoRuta.esperando = false;
            if (window.UiRuta) UiRuta.ocultarLoader();
            console.error("Error calculando ruta:", error);
            UIMensajes.mostrarMensaje("No se pudo calcular la ruta.", 4000);
        }
    };

    const manejarSeleccionRuta = async (x, y) => {
        if (estadoRuta.esperando) return;

        if (!esEdificioSeleccionable(ciudad, x, y)) {
            UIMensajes.mostrarMensaje("Selecciona un edificio válido.", 3000);
            return;
        }

        if (estadoRuta.origen && estadoRuta.destino) {
            limpiarEstadoRuta(true);
        }

        if (!estadoRuta.origen) {
            estadoRuta.origen = { x, y };
            if (window.UiRuta) UiRuta.marcarOrigen(x, y);
            UIMensajes.mostrarMensaje("Selecciona el edificio de destino.", 4000);
            return;
        }

        if (estadoRuta.origen.x === x && estadoRuta.origen.y === y) {
            UIMensajes.mostrarMensaje("El destino debe ser diferente al origen.", 3000);
            return;
        }

        if (!estadoRuta.destino) {
            estadoRuta.destino = { x, y };
            if (window.UiRuta) UiRuta.marcarDestino(x, y);
            await solicitarRuta();
        }
    };

    const setModoConstruccion = (tipo) => {
        tipoElegido = tipo;
        modalidad = "construccion";
        if (mapaContainer) mapaContainer.classList.add("modo-construccion");
        limpiarEstadoRuta(true);
        UIMensajes.mostrarMensaje("Selecciona una casilla para construir.");
    };

    const btnDemoler = document.getElementById("btnDemoler");
    if (btnDemoler) {
        btnDemoler.addEventListener("click", function() {
            modalidad = "demolicion";
            tipoElegido = null;
            if (mapaContainer) mapaContainer.classList.remove("modo-construccion");
            limpiarEstadoRuta(true);

            UIMensajes.mostrarMensaje("Selecciona el edificio o via a demoler.", 4000);
        });
    }

    const btnRuta = document.getElementById("btnRuta");
    if (btnRuta) {
        btnRuta.addEventListener("click", function() {
            if (modalidad === "ruta") {
                cancelarModoRuta();
                return;
            }

            activarModoRuta();
        });
    }
    
    const botonesTipo = [
        { id: "casa", tipo: "R1" },
        { id: "apartamento", tipo: "R2" },
        { id: "tienda", tipo: "C1" },
        { id: "centroComercial", tipo: "C2" },
        { id: "fabrica", tipo: "I1" },
        { id: "granja", tipo: "I2" },
        { id: "policia", tipo: "S1" },
        { id: "bomberos", tipo: "S2" },
        { id: "hospital", tipo: "S3" },
        { id: "electrica", tipo: "U1" },
        { id: "agua", tipo: "U2" },
        { id: "btnParques", tipo: "P1" },
        { id: "calle", tipo: "r1" },
        { id: "carrera", tipo: "r2" }
    ];

    botonesTipo.forEach((btn) => {
        const el = document.getElementById(btn.id);
        if (!el) return;
        el.addEventListener("click", function() {
            setModoConstruccion(btn.tipo);
        });
    });

    if (mapaContainer) {
        mapaContainer.addEventListener("click", function(e) {
            const casilla = e.target.closest(".casilla");
            if (!casilla) return;

            const x = parseInt(casilla.dataset.x, 10);
            const y = parseInt(casilla.dataset.y, 10);

            if (modalidad === "construccion") {
                console.log("CLICK:", { modalidad, tipoElegido, x, y });
                if (!tipoElegido) return;
                modalidadConstruccion(ciudad, x, y, tipoElegido);
            } else if (modalidad === "demolicion") {
                modalidadDemolicion(ciudad, x, y);
            } else if (modalidad === "ruta") {
                manejarSeleccionRuta(x, y);
            }else{
                 if (window.UiRuta && UiRuta.hayRuta()) {
                    limpiarEstadoRuta(true);
                 }
                 modalidadMuestraDatos(ciudad, x, y);
            }
        });
    }
});
