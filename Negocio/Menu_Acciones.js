let modalidad = "ninguna";
let tipoElegido = null;
let ciudad = null;

document.addEventListener("DOMContentLoaded", function() {
    ciudad = cargarCiudad();
    if (!ciudad) return;

    const mapaContainer = document.getElementById("mapaContainer");

    const setModoConstruccion = (tipo) => {
        tipoElegido = tipo;
        modalidad = "construccion";
        if (mapaContainer) mapaContainer.classList.add("modo-construccion");
        UIMensajes.mostrarMensaje("Selecciona una casilla para construir.");
    };

    const btnDemoler = document.getElementById("btnDemoler");
    if (btnDemoler) {
        btnDemoler.addEventListener("click", function() {
            modalidad = "demolicion";
            tipoElegido = null;
            if (mapaContainer) mapaContainer.classList.remove("modo-construccion");

            UIMensajes.mostrarMensaje("Selecciona el edificio o via a demoler.", 4000);
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
                if (!tipoElegido) return;
                modalidadConstruccion(ciudad, x, y, tipoElegido);
            } else if (modalidad === "demolicion") {
                modalidadDemolicion(ciudad, x, y);
            }
        });
    }
});