(function() {
    function asegurarContenedor() {
        let overlay = document.querySelector(".alertas-overlay");
        if (overlay) return overlay;

        overlay = document.createElement("div");
        overlay.className = "alertas-overlay";
        overlay.innerHTML = [
            "<div class=\"alertas-box\">",
            "  <h4 id=\"alertas-titulo\">Aviso</h4>",
            "  <p id=\"alertas-mensaje\"></p>",
            "  <div class=\"alertas-actions\">",
            "    <button class=\"alertas-btn\" id=\"alertas-ok\">Aceptar</button>",
            "  </div>",
            "</div>"
        ].join("");

        document.body.appendChild(overlay);
        return overlay;
    }

    function mostrarAlerta(mensaje, titulo) {
        const overlay = asegurarContenedor();
        const tituloEl = overlay.querySelector("#alertas-titulo");
        const mensajeEl = overlay.querySelector("#alertas-mensaje");
        const okBtn = overlay.querySelector("#alertas-ok");

        if (tituloEl) tituloEl.textContent = titulo || "Aviso";
        if (mensajeEl) mensajeEl.textContent = mensaje || "";

        overlay.classList.add("activo");

        if (okBtn) {
            okBtn.onclick = function() {
                overlay.classList.remove("activo");
            };
        }
    }

    function alertaCamposIncompletos() {
        mostrarAlerta("Por favor completa todos los campos correctamente.");
    }

    function alertaTamanoMapa() {
        mostrarAlerta("El tamano del mapa debe estar entre 15 y 30.");
    }

    function alertaOrientacionMovil() {
        mostrarAlerta("Para jugar, gira tu dispositivo a orientacion vertical.");
    }

    function alertaSinPartida() {
        mostrarAlerta("No hay partida guardada. Crea una nueva ciudad.");
    }

    window.UIAlertas = {
        alertaCamposIncompletos,
        alertaTamanoMapa,
        alertaOrientacionMovil,
        alertaSinPartida
    };
})();
