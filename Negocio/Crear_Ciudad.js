// Crear_Ciudad.js
document.addEventListener("DOMContentLoaded", function() {
    let botonCrear = document.getElementById("botonCrear");

    botonCrear.addEventListener("click", function() {
        

        const nombreCiudad = document.getElementById("nombreCiudadInput").value.trim();
        const nombreAlcalde = document.getElementById("nombreAlcaldeInput").value.trim();
        const region = document.getElementById("regionInput").value.trim();
        const tamanio = parseInt(document.getElementById("tamanioInput").value.trim());

        if (!nombreCiudad || !nombreAlcalde || !region || isNaN(tamanio)) {
            UIAlertas.alertaCamposIncompletos();
            return;
        }
//
       if (tamanio < 15 || tamanio > 30) {
             UIAlertas.alertaTamanoMapa();
                 return;
            }
            
        const alcalde = new Alcalde(nombreAlcalde);
        const mapa = new Mapa(tamanio);
        const ciudad = new Ciudad(nombreCiudad);
        ciudad.mapa=mapa;
        alcalde.ciudad = ciudad;

        
        CiudadStorage.guardar(ciudad);

        
        window.location.href = "Juego.html";
    });
});
