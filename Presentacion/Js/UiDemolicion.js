(function() {
    const getMensaje = () => document.getElementById("mensajeAusuario");

    function limpiarMensaje() {
        const el = getMensaje();
        if (el) el.innerHTML = "";
    }

    function mostrarConfirmacionDemolicion(nombre, onSi, onNo) {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = [
            "<div>",
            `  <p>�Demoler ${nombre}?</p>`,
            "  <button id=\"btnSIdemoler\">SI</button>",
            "  <button id=\"btnNOdemoler\">NO</button>",
            "</div>"
        ].join("");

        const btnSi = document.getElementById("btnSIdemoler");
        const btnNo = document.getElementById("btnNOdemoler");

        if (btnSi) {
            btnSi.addEventListener("click", function() {
                if (typeof onSi === "function") onSi();
            }, { once: true });
        }
        if (btnNo) {
            btnNo.addEventListener("click", function() {
                limpiarMensaje();
                if (typeof onNo === "function") onNo();
            }, { once: true });
        }
    }

    function agregarAvisoAfectados(residencias, empleos) {
        const el = getMensaje();
        if (!el) return;

        if (residencias) {
            el.innerHTML += "<div><p>Habra ciudadanos afectados (perdida de residencia)</p></div>";
        }

        if (empleos) {
            el.innerHTML += "<div><p>Habra ciudadanos afectados (perdida de empleo)</p></div>";
        }
    }

    function mostrarResultadoDemolicion(recuperado) {
        const el = getMensaje();
        if (!el) return;

        el.innerHTML = [
            "<div>",
            "  <p>Edificio demolido</p>",
            `  <p>Dinero recuperado: ${recuperado}</p>`,
            "</div>"
        ].join("");

        setTimeout(limpiarMensaje, 4000);
    }

    window.UIDemolicion = {
        limpiarMensaje,
        mostrarConfirmacionDemolicion,
        agregarAvisoAfectados,
        mostrarResultadoDemolicion
    };
})();
