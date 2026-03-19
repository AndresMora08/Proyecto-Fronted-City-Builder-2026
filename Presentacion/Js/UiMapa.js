(function() {
    function obtenerClaseCelda(valor) {
        if (valor === "g") return "pasto";
        if (valor === "r") return "via";
        if (valor === "r1") return "calle";
        if (valor === "r2") return "carrera";
        if (valor === "R1") return "casa";
        if (valor === "R2") return "apartamento";
        if (valor === "C1") return "tienda";
        if (valor === "C2") return "centro_comercial";
        if (valor === "I1") return "fabrica";
        if (valor === "I2") return "granja";
        if (valor === "S1") return "estacion_policia";
        if (valor === "S2") return "estacion_bomberos";
        if (valor === "S3") return "hospital";
        if (valor === "U1") return "planta_electrica";
        if (valor === "U2") return "planta_agua";
        if (valor === "P1") return "parque";
        return "";
    }

    function renderizarMapa(ciudad) {
        const mapaContainer = document.getElementById("mapaContainer");
        if (!mapaContainer) return;

        const tamanio = ciudad.mapa.tamanio;
        const { ocupados, origenes } = construirMapaOcupacion(ciudad, tamanio);
        let tablaHTML = "<table>";

        for (let i = 0; i < tamanio; i++) {
            tablaHTML += "<tr>";

            for (let j = 0; j < tamanio; j++) {
                if (ocupados[i][j] && !origenes[`${i},${j}`]) {
                    continue;
                }

                const origen = origenes[`${i},${j}`];
                let clase = "";
                let rowspan = 1;
                let colspan = 1;

                if (origen) {
                    clase = obtenerClaseCelda(origen.codigo);
                    rowspan = origen.tamano.alto;
                    colspan = origen.tamano.ancho;
                } else {
                    const valor = ciudad.mapa.matriz[i][j];
                    if (valor !== "o") {
                        clase = obtenerClaseCelda(valor);
                    }
                }

                const spanRows = rowspan > 1 ? ` rowspan="${rowspan}"` : "";
                const spanCols = colspan > 1 ? ` colspan="${colspan}"` : "";

                tablaHTML += `
                    <td class="${clase}"${spanRows}${spanCols}>
                        <button class="casilla" data-x="${i}" data-y="${j}" ></button>
                    </td>
                `;

                if (colspan > 1) {
                    j += colspan - 1;
                }
            }

            tablaHTML += "</tr>";
        }

        tablaHTML += "</table>";
        mapaContainer.innerHTML = tablaHTML;
    }

    function construirMapaOcupacion(ciudad, tamanio) {
        const ocupados = Array.from({ length: tamanio }, () => Array(tamanio).fill(false));
        const origenes = {};

        if (!Array.isArray(ciudad.edificios)) {
            return { ocupados, origenes };
        }

        for (let i = 0; i < ciudad.edificios.length; i++) {
            const edificio = ciudad.edificios[i];
            if (!edificio) continue;

            const codigo = edificio.codigoMapa || (ciudad.mapa.matriz[edificio.x] && ciudad.mapa.matriz[edificio.x][edificio.y]);
            if (!codigo) continue;

            const tamano = obtenerTamanoEdificio(codigo);
            origenes[`${edificio.x},${edificio.y}`] = { codigo, tamano };

            for (let dx = 0; dx < tamano.alto; dx++) {
                for (let dy = 0; dy < tamano.ancho; dy++) {
                    const nx = edificio.x + dx;
                    const ny = edificio.y + dy;
                    if (nx < 0 || ny < 0 || nx >= tamanio || ny >= tamanio) continue;
                    ocupados[nx][ny] = true;
                }
            }
        }

        return { ocupados, origenes };
    }

    function obtenerTamanoEdificio(codigo) {
        if (window.TamanosEdificios && typeof TamanosEdificios.obtenerTamano === "function") {
            return TamanosEdificios.obtenerTamano(codigo);
        }

        return { ancho: 1, alto: 1 };
    }

    window.UIMapa = {
        renderizarMapa
    };
})();
