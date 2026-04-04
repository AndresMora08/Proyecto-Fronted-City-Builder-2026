function modalidadMuestraDatos(ciudad, x, y) {

    const contenedor = document.getElementById("mensajeAusuario");
    if (!contenedor) return;

    const encontrado = buscarEdificioEnPosicion(ciudad, x, y);

    if (!encontrado) {
        contenedor.innerHTML = "<div class='panel-info'><p>No hay edificio aquí</p></div>";
        return;
    }

    const { edificio } = encontrado;

    let html = `
        <div class="overlay-panel">
            <div class="panel-info">

                <h3>${edificio.nombre}</h3>

                <p><b>Tipo:</b> ${edificio.tipo}</p>
                <p><b>Costo construcción:</b> ${edificio.costoConstruccion || 0}</p>

                <p><b>Consumo agua:</b> ${edificio.consumoAgua || 0}</p>
                <p><b>Consumo electricidad:</b> ${edificio.consumoElectricidad || 0}</p>
    `;

    /* PRODUCCIÓN */
    if (edificio.produccion !== undefined) {
        html += `<p><b>Producción:</b> ${edificio.produccion}</p>`;
    }

    /* CAPACIDAD */
    if (edificio.capacidadMaxima !== undefined) {
        html += `<p><b>Capacidad:</b> ${edificio.capacidadMaxima}</p>`;
    }

    /* OCUPACIÓN */
    if (edificio.ciudadanosViviendo) {
        html += `<p><b>Ocupación:</b> ${edificio.ciudadanosViviendo.length}</p>`;
    }

    if (edificio.ciudadanosEmpleados) {
        html += `<p><b>Empleados:</b> ${edificio.ciudadanosEmpleados.length}</p>`;
    }

    /* RESIDENCIAL */
    if (edificio.tipo === "Casa" || edificio.tipo === "Apartamento") {

        const residentes = edificio.ciudadanosViviendo || [];

        let felicidadPromedio = "Sin residentes";

        if (residentes.length > 0) {
            let suma = 0;

            for (let i = 0; i < residentes.length; i++) {
                suma += residentes[i].nivelFelicidad;
            }

            felicidadPromedio = (suma / residentes.length).toFixed(2);
        }

        html += `
            <p><b>Ciudadanos viviendo:</b> ${residentes.length}</p>
            <p><b>Felicidad promedio:</b> ${felicidadPromedio}</p>
        `;
    }

    html += `
                <button id="cerrarPanel">Cerrar</button>
            </div>
        </div>
    `;

    contenedor.innerHTML = html;

    /* BOTÓN CERRAR */
    document.getElementById("cerrarPanel").addEventListener("click", () => {
        contenedor.innerHTML = "";
    });

    /* CLICK FUERA */
    const overlay = contenedor.querySelector(".overlay-panel");

    overlay.addEventListener("click", function(e) {
        if (e.target === overlay) {
            contenedor.innerHTML = "";
        }
    });


}