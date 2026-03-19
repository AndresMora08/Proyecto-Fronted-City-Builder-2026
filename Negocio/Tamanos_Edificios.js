(function() {
    const TAMANOS = {
        R1: { ancho: 1, alto: 1 }, // Casa
        R2: { ancho: 1, alto: 1 }, // Apartamento (asset 1x1)
        C1: { ancho: 1, alto: 1 }, // Tienda
        C2: { ancho: 2, alto: 2 }, // Centro comercial
        I1: { ancho: 2, alto: 1 }, // Fabrica
        I2: { ancho: 1, alto: 1 }, // Granja
        S1: { ancho: 2, alto: 1 }, // Estacion policia
        S2: { ancho: 2, alto: 1 }, // Estacion bomberos
        S3: { ancho: 2, alto: 1 }, // Hospital
        U1: { ancho: 1, alto: 1 }, // Planta electrica
        U2: { ancho: 1, alto: 1 }, // Planta agua
        P1: { ancho: 2, alto: 1 }, // Parque
        r1: { ancho: 1, alto: 1 },
        r2: { ancho: 1, alto: 1 }
    };

    const CODIGOS_VIA = new Set(["r", "r1", "r2"]);

    function obtenerTamano(codigo) {
        return TAMANOS[codigo] || { ancho: 1, alto: 1 };
    }

    function esVia(codigo) {
        return CODIGOS_VIA.has(codigo);
    }

    function sincronizarMatriz(ciudad) {
        if (!ciudad || !ciudad.mapa || !ciudad.mapa.matriz) return;

        const matriz = ciudad.mapa.matriz;
        const tamanio = ciudad.mapa.tamanio;

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

            const codigo = edificio.codigoMapa || (matriz[edificio.x] && matriz[edificio.x][edificio.y]);
            if (!codigo) continue;

            const tamano = obtenerTamano(codigo);
            for (let dx = 0; dx < tamano.alto; dx++) {
                for (let dy = 0; dy < tamano.ancho; dy++) {
                    const nx = edificio.x + dx;
                    const ny = edificio.y + dy;
                    if (nx < 0 || ny < 0 || nx >= tamanio || ny >= tamanio) continue;

                    matriz[nx][ny] = dx === 0 && dy === 0 ? codigo : "o";
                }
            }
        }
    }

    window.TamanosEdificios = {
        obtenerTamano,
        esVia,
        sincronizarMatriz
    };
})();