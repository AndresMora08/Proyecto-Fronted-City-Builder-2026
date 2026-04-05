(function() {
    let timeouts = [];
    let rutaActiva = false;

    function obtenerMapaContainer() {
        return document.getElementById("mapaContainer");
    }

    function obtenerLoader() {
        let loader = document.getElementById("rutaLoader");
        if (loader) return loader;

        const contenedor = obtenerMapaContainer();
        if (!contenedor) return null;

        loader = document.createElement("div");
        loader.id = "rutaLoader";
        loader.classList.add("hidden");
        loader.innerHTML = `
            <div class="ruta-loader-card">
                <span class="ruta-loader-spinner" aria-hidden="true"></span>
                <span class="ruta-loader-text">Calculando ruta...</span>
            </div>
        `;
        contenedor.appendChild(loader);
        return loader;
    }

    function mostrarLoader(texto) {
        const loader = obtenerLoader();
        if (!loader) return;
        const textoEl = loader.querySelector(".ruta-loader-text");
        if (textoEl && texto) textoEl.textContent = texto;
        loader.classList.remove("hidden");
    }

    function ocultarLoader() {
        const loader = obtenerLoader();
        if (!loader) return;
        loader.classList.add("hidden");
    }

    function limpiarTimeouts() {
        timeouts.forEach((id) => clearTimeout(id));
        timeouts = [];
    }

    function limpiarRuta() {
        limpiarTimeouts();
        const casillas = document.querySelectorAll(".casilla.ruta-step");
        casillas.forEach((c) => c.classList.remove("ruta-step"));
        rutaActiva = false;
    }

    function limpiarSeleccion() {
        const casillas = document.querySelectorAll(".casilla.ruta-origen, .casilla.ruta-destino");
        casillas.forEach((c) => {
            c.classList.remove("ruta-origen");
            c.classList.remove("ruta-destino");
        });
    }

    function obtenerCasilla(x, y) {
        return document.querySelector(`.casilla[data-x="${x}"][data-y="${y}"]`);
    }

    function marcarOrigen(x, y) {
        const casilla = obtenerCasilla(x, y);
        if (casilla) casilla.classList.add("ruta-origen");
    }

    function marcarDestino(x, y) {
        const casilla = obtenerCasilla(x, y);
        if (casilla) casilla.classList.add("ruta-destino");
    }

    function animarRuta(ruta) {
        limpiarRuta();
        if (!Array.isArray(ruta) || ruta.length === 0) return;

        rutaActiva = true;
        ruta.forEach((paso, index) => {
            const { x, y } = normalizarPaso(paso);
            if (x === null || y === null) return;

            const id = setTimeout(() => {
                const casilla = obtenerCasilla(x, y);
                if (casilla) casilla.classList.add("ruta-step");
            }, index * 60);
            timeouts.push(id);
        });
    }

    function normalizarPaso(paso) {
        if (Array.isArray(paso) && paso.length >= 2) {
            return { x: Number(paso[0]), y: Number(paso[1]) };
        }
        if (paso && typeof paso === "object") {
            return { x: Number(paso.x), y: Number(paso.y) };
        }
        return { x: null, y: null };
    }

    function hayRuta() {
        return rutaActiva;
    }

    window.UiRuta = {
        mostrarLoader,
        ocultarLoader,
        limpiarRuta,
        limpiarSeleccion,
        marcarOrigen,
        marcarDestino,
        animarRuta,
        hayRuta
    };
})();

