(function() {
    const getMensaje = () => document.getElementById("mensajeAusuario");

    function limpiarMensaje() {
        const el = getMensaje();
        if (el) el.innerHTML = "";
    }

    function mostrarMensaje(texto, ms) {
        const el = getMensaje();
        if (!el) return;
        el.innerHTML = `<div><p>${texto}</p></div>`;
        if (typeof ms === "number" && ms > 0) {
            setTimeout(limpiarMensaje, ms);
        }
    }

    window.UIMensajes = {
        limpiarMensaje,
        mostrarMensaje
    };
})();
