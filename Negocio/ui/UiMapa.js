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
        aplicarClaseMapa(mapaContainer, tamanio);
        const { ocupados, origenes } = construirMapaOcupacion(ciudad, tamanio);
        const tabla = obtenerTablaMapa(mapaContainer);
        tabla.textContent = "";

        for (let i = 0; i < tamanio; i++) {
            const fila = document.createElement("tr");

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

                const celda = document.createElement("td");
                if (clase) {
                    celda.classList.add(clase);
                }
                if (spanRows) {
                    celda.rowSpan = rowspan;
                }
                if (spanCols) {
                    celda.colSpan = colspan;
                }

                const boton = document.createElement("button");
                boton.className = "casilla";
                boton.dataset.x = i;
                boton.dataset.y = j;
                celda.appendChild(boton);
                fila.appendChild(celda);

                if (colspan > 1) {
                    j += colspan - 1;
                }
            }

            tabla.appendChild(fila);
        }
    }

    function aplicarClaseMapa(mapaContainer, tamanio) {
        const claseBase = "map-size-";
        const tamanioSeguro = Math.min(Math.max(tamanio, 15), 30);

        Array.from(mapaContainer.classList).forEach((clase) => {
            if (clase.startsWith(claseBase)) {
                mapaContainer.classList.remove(clase);
            }
        });

        mapaContainer.classList.add(`${claseBase}${tamanioSeguro}`);
    }

    function obtenerTablaMapa(mapaContainer) {
        let tabla = mapaContainer.querySelector("#mapaTabla");
        if (!tabla) {
            tabla = document.createElement("table");
            tabla.id = "mapaTabla";
            mapaContainer.appendChild(tabla);
        }

        return tabla;
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
