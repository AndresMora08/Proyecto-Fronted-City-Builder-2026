(function() {
    const getMensaje = () => document.getElementById("mensajeAusuario");

    function limpiarMensaje() {
        const el = getMensaje();
        if (el) el.innerHTML = "";
    }

    function mostrarErrorConstruccion() {
        const el = getMensaje();
        if (!el) return;
        el.innerHTML = "<div><p>No tienes suficiente dinero o no hay via cercana</p></div>";
        setTimeout(limpiarMensaje, 4000);
    }

    function mostrarExitoConstruccion() {
        const el = getMensaje();
        if (!el) return;
        el.innerHTML = "<div><p>Construccion exitosa</p></div>";
        setTimeout(limpiarMensaje, 5000);
    }

    function mostrarPromptNombreEdificio(nombreSugerido, onConfirmar) {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = [
            "<div>",
            "  <label>Ingrese un nombre para el edificio</label>",
            `  <input type=\"text\" id=\"nombreEdificio\" value=\"${nombreSugerido || ""}\">`,
            "  <button id=\"confirmarNombre\">Confirmar</button>",
            "</div>"
        ].join("");

        const btn = document.getElementById("confirmarNombre");
        if (!btn) return;
        btn.addEventListener("click", function() {
            const input = document.getElementById("nombreEdificio");
            const valor = input ? input.value.trim() : "";
            limpiarMensaje();
            if (typeof onConfirmar === "function") onConfirmar(valor);
        }, { once: true });
    }

    window.UIConstruccion = {
        limpiarMensaje,
        mostrarErrorConstruccion,
        mostrarExitoConstruccion,
        mostrarPromptNombreEdificio
    };
})();
