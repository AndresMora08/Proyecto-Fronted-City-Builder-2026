(function() {
    const CODIGOS_VALIDOS = new Set([
        "g",
        "r",
        "r1",
        "r2",
        "R1",
        "R2",
        "C1",
        "C2",
        "I1",
        "I2",
        "S1",
        "S2",
        "S3",
        "U1",
        "U2",
        "P1"
    ]);

    const CODIGOS_VIA = new Set(["r", "r1", "r2"]);

    const TAMANOS_FALLBACK = {
        R1: { ancho: 1, alto: 1 },
        R2: { ancho: 1, alto: 1 },
        C1: { ancho: 1, alto: 1 },
        C2: { ancho: 2, alto: 2 },
        I1: { ancho: 2, alto: 1 },
        I2: { ancho: 1, alto: 1 },
        S1: { ancho: 2, alto: 1 },
        S2: { ancho: 2, alto: 1 },
        S3: { ancho: 2, alto: 1 },
        U1: { ancho: 1, alto: 1 },
        U2: { ancho: 1, alto: 1 },
        P1: { ancho: 2, alto: 1 },
        r: { ancho: 1, alto: 1 },
        r1: { ancho: 1, alto: 1 },
        r2: { ancho: 1, alto: 1 }
    };

    function obtenerTamanoCodigo(codigo) {
        if (window.TamanosEdificios && typeof TamanosEdificios.obtenerTamano === "function") {
            return TamanosEdificios.obtenerTamano(codigo);
        }
        return TAMANOS_FALLBACK[codigo] || { ancho: 1, alto: 1 };
    }

    function mostrarErrorMapa(mensaje) {
        if (window.UIAlertas && typeof UIAlertas.alertaErrorMapa === "function") {
            UIAlertas.alertaErrorMapa(mensaje);
            return;
        }
        alert(mensaje);
    }

    function parsearFilas(contenido) {
        const lineas = String(contenido || "").split(/\r?\n/);
        const filas = [];

        for (let i = 0; i < lineas.length; i++) {
            const lineaOriginal = lineas[i];
            const linea = lineaOriginal.trim();
            if (!linea) continue;

            const limpia = linea.replace(/[\[\]]/g, "");
            if (!/[A-Za-z0-9]/.test(limpia)) continue;

            const partes = limpia
                .split(",")
                .map((p) => p.trim())
                .filter((p) => p.length > 0);

            if (partes.length === 0) continue;

            for (let j = 0; j < partes.length; j++) {
                const codigo = partes[j];
                if (!CODIGOS_VALIDOS.has(codigo)) {
                    return {
                        error: `Codigo desconocido "${codigo}" en fila ${filas.length + 1}.`
                    };
                }
            }

            filas.push(partes);
        }

        if (filas.length === 0) {
            return { error: "No se detectaron filas validas en el archivo." };
        }

        const size = filas[0].length;
        if (size < 15 || size > 30) {
            return { error: "El tamano del mapa debe estar entre 15 y 30." };
        }

        if (filas.length !== size) {
            return { error: `El mapa debe ser cuadrado. Filas: ${filas.length}, columnas: ${size}.` };
        }

        for (let i = 0; i < filas.length; i++) {
            if (filas[i].length !== size) {
                return { error: `La fila ${i + 1} tiene ${filas[i].length} columnas y se esperaban ${size}.` };
            }
        }

        return { filas, size };
    }

    function crearEdificioPorCodigo(codigo, x, y) {
        if (CODIGOS_VIA.has(codigo)) {
            return Via.crearVia(null, x, y, codigo);
        }

        if (codigo === "R1") return Edificio_Residencial.crearCasa(null, x, y, codigo);
        if (codigo === "R2") return Edificio_Residencial.crearApartamento(null, x, y, codigo);
        if (codigo === "C1") return Edificio_Comercial.crearTienda(null, x, y, codigo);
        if (codigo === "C2") return Edificio_Comercial.crearCentroComercial(null, x, y, codigo);
        if (codigo === "I1") return Edificio_Industrial.crearFabrica(null, x, y, codigo);
        if (codigo === "I2") return Edificio_Industrial.crearGranja(null, x, y, codigo);
        if (codigo === "S1") return Edificio_Servicios.crearEstacionPolicia(null, x, y, codigo);
        if (codigo === "S2") return Edificio_Servicios.crearEstacionBomberos(null, x, y, codigo);
        if (codigo === "S3") return Edificio_Servicios.crearHospital(null, x, y, codigo);
        if (codigo === "U1") return Planta_Utilidad.crearPlantaElectrica(null, x, y, codigo);
        if (codigo === "U2") return Planta_Utilidad.crearPlantaAgua(null, x, y, codigo);
        if (codigo === "P1") return Parque.crearParque(null, x, y, codigo);
        return null;
    }

    function validarViaAdyacente(ciudadTemp, codigo, x, y, tamano) {
        if (typeof tieneViaAdyacente === "function") {
            return tieneViaAdyacente(x, y, ciudadTemp, codigo, tamano);
        }

        const mapa = ciudadTemp.mapa._matriz;
        const tamanioMapa = ciudadTemp.mapa._tamanio;
        const direcciones = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
        ];

        for (let dx = 0; dx < tamano.alto; dx++) {
            for (let dy = 0; dy < tamano.ancho; dy++) {
                const celdaX = x + dx;
                const celdaY = y + dy;

                for (let i = 0; i < direcciones.length; i++) {
                    const nx = celdaX + direcciones[i][0];
                    const ny = celdaY + direcciones[i][1];
                    if (nx < 0 || ny < 0 || nx >= tamanioMapa || ny >= tamanioMapa) continue;
                    const v = mapa[nx][ny];
                    if (v === "r" || v === "r1" || v === "r2") return true;
                }
            }
        }

        return false;
    }

    function calcularRecursosIniciales(ciudad) {
        let produccion = { dinero: 0, electricidad: 0, agua: 0, alimento: 0 };
        let consumo = { electricidad: 0, agua: 0 };
        let costoTotal = 0;

        for (let i = 0; i < ciudad.edificios.length; i++) {
            const edificio = ciudad.edificios[i];
            if (!edificio) continue;

            costoTotal += Number(edificio._costoConstruccion || 0);

            if (edificio._ingresos) {
                produccion.dinero += edificio._ingresos;
            }

            if (edificio._produccion) {
                if (edificio._tipo === "Fabrica") {
                    produccion.dinero += edificio._produccion;
                }
                if (edificio._tipo === "Planta electrica") {
                    produccion.electricidad += edificio._produccion;
                }
                if (edificio._tipo === "Planta de agua") {
                    produccion.agua += edificio._produccion;
                }
                if (edificio._tipo === "Granja") {
                    produccion.alimento += edificio._produccion;
                }
            }

            consumo.electricidad += Number(edificio._consumoElectricidad || 0);
            consumo.agua += Number(edificio._consumoAgua || 0);
        }

        const dineroBase = 50000;
        ciudad.dinero = Math.max(0, dineroBase - costoTotal + produccion.dinero);
        ciudad.electricidad = produccion.electricidad - consumo.electricidad;
        ciudad.agua = produccion.agua - consumo.agua;
        ciudad.alimento = produccion.alimento;
        ciudad.poblacion = 0;
        ciudad.puntuacion = 0;
        ciudad.ciudadanos = [];
    }

    function importarMapaDesdeTxt(contenido, nombreArchivo) {
        const resultado = parsearFilas(contenido);
        if (resultado.error) {
            mostrarErrorMapa(resultado.error);
            return;
        }

        const { filas, size } = resultado;
        const matriz = Array.from({ length: size }, () => Array(size).fill("g"));
        const usados = Array.from({ length: size }, () => Array(size).fill(false));
        const edificios = [];

        // Primer paso: vias
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const codigo = filas[x][y];
                if (!CODIGOS_VIA.has(codigo)) continue;

                matriz[x][y] = codigo;
                const via = crearEdificioPorCodigo(codigo, x, y);
                if (via) edificios.push(via);
            }
        }

        // Segundo paso: edificios
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (usados[x][y]) continue;

                const codigo = filas[x][y];
                if (codigo === "g" || CODIGOS_VIA.has(codigo)) {
                    usados[x][y] = true;
                    continue;
                }

                const tamano = obtenerTamanoCodigo(codigo);

                for (let dx = 0; dx < tamano.alto; dx++) {
                    for (let dy = 0; dy < tamano.ancho; dy++) {
                        const nx = x + dx;
                        const ny = y + dy;

                        if (nx < 0 || ny < 0 || nx >= size || ny >= size) {
                            mostrarErrorMapa(`El edificio ${codigo} en (${x + 1},${y + 1}) se sale del mapa.`);
                            return;
                        }

                        if (filas[nx][ny] !== codigo) {
                            mostrarErrorMapa(`${codigo} incompleto, falta celda en (${nx + 1},${ny + 1}).`);
                            return;
                        }

                        if (usados[nx][ny]) {
                            mostrarErrorMapa(`Solapamiento: ${codigo} en (${x + 1},${y + 1}) choca con otra estructura en (${nx + 1},${ny + 1}).`);
                            return;
                        }
                    }
                }

                const edificio = crearEdificioPorCodigo(codigo, x, y);
                if (!edificio) {
                    mostrarErrorMapa(`No se pudo crear el edificio ${codigo} en (${x + 1},${y + 1}).`);
                    return;
                }

                for (let dx = 0; dx < tamano.alto; dx++) {
                    for (let dy = 0; dy < tamano.ancho; dy++) {
                        const nx = x + dx;
                        const ny = y + dy;
                        usados[nx][ny] = true;
                        matriz[nx][ny] = dx === 0 && dy === 0 ? codigo : "o";
                    }
                }

                edificios.push(edificio);
            }
        }

        const ciudad = CiudadStorage.cargar();
        if (!ciudad) {
            mostrarErrorMapa("No hay una ciudad cargada para aplicar el mapa.");
            return;
        }

        const ciudadTemp = { mapa: { _matriz: matriz, _tamanio: size } };
        for (let i = 0; i < edificios.length; i++) {
            const edificio = edificios[i];
            if (!edificio || CODIGOS_VIA.has(edificio._codigoMapa)) continue;

            const tamano = obtenerTamanoCodigo(edificio._codigoMapa);
            if (!validarViaAdyacente(ciudadTemp, edificio._codigoMapa, edificio._x, edificio._y, tamano)) {
                mostrarErrorMapa(`El edificio ${edificio._codigoMapa} en (${edificio._x + 1},${edificio._y + 1}) no tiene via adyacente.`);
                return;
            }
        }

        ciudad.mapa = new Mapa(size);
        ciudad.mapa._matriz = matriz;
        ciudad.edificios = edificios;

        calcularRecursosIniciales(ciudad);

        if (window.TamanosEdificios && typeof TamanosEdificios.sincronizarMatriz === "function") {
            TamanosEdificios.sincronizarMatriz(ciudad);
        }

        CiudadStorage.guardar(ciudad);

        if (typeof mostrarDatosCiudad === "function") {
            mostrarDatosCiudad(ciudad);
        }

        if (window.UIMapa && typeof UIMapa.renderizarMapa === "function") {
            UIMapa.renderizarMapa(ciudad);
        }

        if (window.UIMensajes && typeof UIMensajes.mostrarMensaje === "function") {
            const nombre = nombreArchivo ? ` (${nombreArchivo})` : "";
            UIMensajes.mostrarMensaje(`Mapa cargado correctamente${nombre}.`, 4000);
        }
    }

    window.importarMapaDesdeTxt = importarMapaDesdeTxt;
})();
