(function() {
    const getMensaje = () => document.getElementById("mensajeAusuario");

    function limpiarMensaje() {
        const el = getMensaje();
        if (el) el.innerHTML = "";
    }

function mostrarConfirmacionDemolicion(nombre, conResidencias, conEmpleos, onSi, onNo) {
        const el = document.getElementById("mensajeAusuario");
        if (!el) return;

        let avisos = "";
        if (conResidencias) {
            avisos += "<div><p>Habra ciudadanos afectados (perdida de residencia)</p></div>";
        }
        if (conEmpleos) {
            avisos += "<div><p>Habra ciudadanos afectados (perdida de empleo)</p></div>";
        }

        el.innerHTML = `
            <div>
                <p>¿Demoler ${nombre}?</p>
                ${avisos}
            <button id="btnSIdemoler">SI</button>
            <button id="btnNOdemoler">NO</button>
        </div>
    `;

  
    document.getElementById("btnSIdemoler").onclick = function() {
        el.innerHTML = "";
        onSi(); // ejecuta demolición
    };

    document.getElementById("btnNOdemoler").onclick = function() {
        el.innerHTML = "";
        onNo(); // cancelar
    };
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