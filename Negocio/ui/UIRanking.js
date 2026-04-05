(function () {

    const getContenedor = () => document.getElementById("contenedorRanking");

    function limpiarMensaje() {
        const el = getContenedor();
        if (el) el.innerHTML = "";
    }

    function mostrarRanking(ciudadActual) {

        const contenedor = getContenedor();
        if (!contenedor) return;

        
        contenedor.classList.remove("hidden");

        const ranking = RankingStorage.obtenerRanking();
        let rankingTemporal = [...ranking];

        if (ciudadActual) {
            rankingTemporal.push({
                cityName: ciudadActual.nombreCiudad,
                mayor: alcalde ? alcalde.nombreAlcalde : "Desconocido",
                score: ciudadActual.puntuacion,
                population: ciudadActual.poblacion,
                happiness: ciudadActual.felicidadPromedio === -1
                    ? "--"
                    : Math.round(ciudadActual.felicidadPromedio),
                turns: ciudadActual.turno,
                esActual: true
            });
        }

        rankingTemporal.sort((a, b) => b.score - a.score);

        limpiarMensaje();

        const titulo = document.createElement("h2");
        titulo.textContent = "Ranking de Ciudades";
        contenedor.appendChild(titulo);

        const tabla = document.createElement("table");

        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>#</th>
                <th>Ciudad</th>
                <th>Alcalde</th>
                <th>Puntuación</th>
                <th>Población</th>
                <th>Felicidad</th>
                <th>Turnos</th>
            </tr>
        `;
        tabla.appendChild(thead);

        const tbody = document.createElement("tbody");

        for (let i = 0; i < rankingTemporal.length && i < 10; i++) {

            const item = rankingTemporal[i];
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>#${i + 1}</td>
                <td>${item.cityName}</td>
                <td>${item.mayor}</td>
                <td>PTS: ${item.score}</td>
                <td>${item.population}</td>
                <td>${item.happiness}</td>
                <td>${item.turns}</td>
            `;

            if (item.esActual) {
                fila.classList.add("fila-actual");
            }

            tbody.appendChild(fila);
        }

        tabla.appendChild(tbody);
        contenedor.appendChild(tabla);

        if (ciudadActual) {

            const posicion = rankingTemporal.findIndex(c => c.esActual);

            if (posicion >= 10) {

                const info = document.createElement("p");
                info.textContent =
                    `Tu ciudad: #${posicion + 1} | ${ciudadActual.nombreCiudad} | PTS: ${ciudadActual.puntuacion}`;

                contenedor.appendChild(info);
            }
        }

        const btnCerrar = document.createElement("button");
        btnCerrar.textContent = "Cerrar";

        btnCerrar.onclick = function () {
            limpiarMensaje();

            
            contenedor.classList.add("hidden");
        };

        contenedor.appendChild(btnCerrar);
    }

    window.UIRanking = {
        mostrarRanking,
        limpiarMensaje
    };

})();