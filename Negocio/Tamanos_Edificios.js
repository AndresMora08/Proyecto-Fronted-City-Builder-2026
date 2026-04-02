(function() {
    const TAMANOS = {
        R1: { ancho: 1, alto: 1 }, // Casa
        R2: { ancho: 1, alto: 1 }, // Apartamento
        C1: { ancho: 1, alto: 1 }, // Tienda
        C2: { ancho: 2, alto: 2 }, // centro comercial
        I1: { ancho: 2, alto: 1 }, // dabrica
        I2: { ancho: 1, alto: 1 }, // granja
        S1: { ancho: 2, alto: 1 }, // Estacion policia
        S2: { ancho: 2, alto: 1 }, // estacion bomberos
        S3: { ancho: 2, alto: 1 }, // hospital
        U1: { ancho: 1, alto: 1 }, // Planta electrica
        U2: { ancho: 1, alto: 1 }, // Planta agua
        P1: { ancho: 2, alto: 1 }, // parque
        r1: { ancho: 1, alto: 1 }, // calle
        r2: { ancho: 1, alto: 1 }  // carrera
    };

    const CODIGOS_VIA = new Set(["r1", "r2"]);

    function obtenerTamano(codigo) {
        return TAMANOS[codigo] || { ancho: 1, alto: 1 };
    }

    function esVia(codigo) {
        return CODIGOS_VIA.has(codigo);
    }

    function sincronizarMatriz(ciudad) {
        if (!ciudad || !ciudad.mapa) return;

        const matriz = ciudad.mapa.matriz;
        const tamanio = ciudad.mapa.tamanio;
        if (!matriz || !tamanio) return;

        for (let x = 0; x < tamanio; x++) {
            for (let y = 0; y < tamanio; y++) {
                if (matriz[x][y] === "o") {
                    matriz[x][y] = "g";
                }
            }
        }

        if (!Array.isArray(ciudad.edificios)) return;

        for (let i = 0; i < ciudad.edificios.length; i++) {
            const edificio = ciudad.edificios[i];
            if (!edificio) continue;

            const codigo =
                edificio._codigoMapa ||
                edificio.codigoMapa ||
                (matriz[edificio._x] && matriz[edificio._x][edificio._y]) ||
                (matriz[edificio.x] && matriz[edificio.x][edificio.y]);
            if (!codigo) continue;

            const tamano = obtenerTamano(codigo);
            for (let dx = 0; dx < tamano.alto; dx++) {
                for (let dy = 0; dy < tamano.ancho; dy++) {
                    const baseX = edificio._x ?? edificio.x;
                    const baseY = edificio._y ?? edificio.y;
                    const nx = baseX + dx;
                    const ny = baseY + dy;
                    if (nx < 0 || ny < 0 || nx >= tamanio || ny >= tamanio) continue;

                    matriz[nx][ny] = dx === 0 && dy === 0 ? codigo : "o";
                }
            }
        }

        ciudad.mapa.matriz = matriz;
        ciudad.mapa.tamanio = tamanio;
    }

    window.TamanosEdificios = {
        obtenerTamano,
        esVia,
        sincronizarMatriz
    };
})();
