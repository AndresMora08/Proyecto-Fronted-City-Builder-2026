// Crear_Ciudad.js

document.addEventListener("DOMContentLoaded", () => {
    const btnCrear = document.getElementById("botonCrear");

    btnCrear.addEventListener("click", async () => {
        //Capturar datos del HTML
        const nombreC = document.getElementById("nombreCiudadInput").value;
        const nombreA = document.getElementById("nombreAlcaldeInput").value;
        const region = document.getElementById("regionInput").value;
        const tam = parseInt(document.getElementById("tamanioInput").value);

        //Validación
        if (!nombreC || !nombreA || isNaN(tam)) {
            alert("Completa todos los campos"); // O usa tu UiAlertas.js
            return;
        }

        //Instanciar modelos
        const miMapa = new Mapa(tam);

        const coordenadas = await obtenerCoordenadasCiudad(nombreC, region);
        if (!coordenadas) {
            alert("No se pudo encontrar la ciudad. Intenta con formato: Ciudad, Departamento, CO");
            return;
        }

        const nuevaCiudad = new Ciudad(nombreC, coordenadas.lat, coordenadas.lon);
        nuevaCiudad.region = region;
        nuevaCiudad.mapa = miMapa;

        const nuevoAlcalde = new Alcalde(nombreA, region);

        //Guardar
        CiudadStorage.guardar(nuevaCiudad);

        window.location.href = "Juego.html"; 
    });
});
