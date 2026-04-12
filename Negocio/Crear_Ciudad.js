// Crear_Ciudad.js
document.addEventListener("DOMContentLoaded", () => {
    const btnCrear = document.getElementById("botonCrear");

    let timeoutBusqueda;
    document.getElementById("regionInput").addEventListener("input", function() {
        clearTimeout(timeoutBusqueda);
        const texto = this.value;

        timeoutBusqueda = setTimeout(async () => {
            // LLAMADA DIRECTA A LA NUEVA FUNCIÓN DE LA API
            const sugerencias = await buscarSugerenciasGeo(texto);
            const lista = document.getElementById("listaSugerencias");
            lista.innerHTML = "";

            sugerencias.forEach(s => {
                const opcion = document.createElement("option");
                opcion.value = s.descripcion;
                lista.appendChild(opcion);
            });
        }, 400);
    });

    btnCrear.addEventListener("click", async () => {
        //Capturar datos del HTML
        const nombreC = document.getElementById("nombreCiudadInput").value;
        const nombreA = document.getElementById("nombreAlcaldeInput").value;
        const region = document.getElementById("regionInput").value;
        const tam = parseInt(document.getElementById("tamanioInput").value);

        //Validación
        if (!nombreC || !nombreA || isNaN(tam)) {
            alert("Completa todos los campos");
            return;
        }

        //Instanciar modelos
        const miMapa = new Mapa(tam);

        let coordenadas = await obtenerCoordenadasCiudad(region || nombreC, "");
        if (!coordenadas) {
            coordenadas = { lat: NaN, lon: NaN };
        }

        const nuevaCiudad = new Ciudad(nombreC, coordenadas.lat, coordenadas.lon);
        nuevaCiudad.region = region;
        nuevaCiudad.mapa = miMapa;

        const nuevoAlcalde = new Alcalde(nombreA, region);

        let lat, lon;
        const latM = parseFloat(document.getElementById("latInput").value);
        const lonM = parseFloat(document.getElementById("lonInput").value);

        // Validación de prioridad
        if (!isNaN(latM) && !isNaN(lonM)) {
            lat = latM;
            lon = lonM;
        } else {
            // LLAMADA A LA API
            const geo = await obtenerCoordenadasCiudad(region);
            if (geo) {
                lat = geo.lat;
                lon = geo.lon;
            }
        }

        //Guardar
        CiudadStorage.guardar(nuevaCiudad);
        AlcaldeStorage.guardar(nuevoAlcalde);

        window.location.href = "Juego.html"; 
    });
});
