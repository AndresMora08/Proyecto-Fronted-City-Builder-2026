async function calcularRuta(mapa, origen, destino) {
    const payload = {
        map: mapa,
        origin: origen,
        destination: destino
    };

    try {
        const respuesta = await fetch("/api/calculate-route", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (respuesta.ok) {
            return respuesta.json();
        }
    } catch (error) {
        console.warn("Backend de rutas no disponible, usando mock.");
    }

    return calcularRutaMock(payload.map, payload.origin, payload.destination);
}

function calcularRutaMock(mapa, origen, destino) {
    if (!Array.isArray(mapa) || !mapa.length) return { route: [] };

    const filas = mapa.length;
    const columnas = mapa[0].length;

    const dentro = (x, y) => x >= 0 && y >= 0 && x < filas && y < columnas;
    const key = (x, y) => `${x},${y}`;

    const inicio = { x: Number(origen.x), y: Number(origen.y) };
    const fin = { x: Number(destino.x), y: Number(destino.y) };

    if (!dentro(inicio.x, inicio.y) || !dentro(fin.x, fin.y)) {
        return { route: [] };
    }

    const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    const obtenerVecinosVias = (punto) => {
        if (mapa[punto.x][punto.y] === 1) {
            return [{ x: punto.x, y: punto.y }];
        }

        const vecinos = [];
        for (let i = 0; i < dirs.length; i++) {
            const nx = punto.x + dirs[i][0];
            const ny = punto.y + dirs[i][1];
            if (!dentro(nx, ny)) continue;
            if (mapa[nx][ny] === 1) {
                vecinos.push({ x: nx, y: ny });
            }
        }
        return vecinos;
    };

    const inicios = obtenerVecinosVias(inicio);
    const objetivos = obtenerVecinosVias(fin);

    if (inicios.length === 0 || objetivos.length === 0) {
        return { route: [] };
    }

    const visitado = new Set();
    const cola = [];
    const prev = {};

    inicios.forEach((p) => {
        cola.push(p);
        visitado.add(key(p.x, p.y));
    });

    const objetivosSet = new Set(objetivos.map((p) => key(p.x, p.y)));
    let objetivoEncontrado = null;

    while (cola.length) {
        const actual = cola.shift();
        const actualKey = key(actual.x, actual.y);
        if (objetivosSet.has(actualKey)) {
            objetivoEncontrado = actual;
            break;
        }

        for (let i = 0; i < dirs.length; i++) {
            const nx = actual.x + dirs[i][0];
            const ny = actual.y + dirs[i][1];
            if (!dentro(nx, ny)) continue;
            if (mapa[nx][ny] !== 1) continue;

            const k = key(nx, ny);
            if (visitado.has(k)) continue;

            visitado.add(k);
            prev[k] = actual;
            cola.push({ x: nx, y: ny });
        }
    }

    const ruta = [];
    if (!objetivoEncontrado) {
        return { route: [] };
    }

    let cur = objetivoEncontrado;
    ruta.push({ x: cur.x, y: cur.y });
    while (!inicios.some((p) => p.x === cur.x && p.y === cur.y)) {
        const k = key(cur.x, cur.y);
        cur = prev[k];
        if (!cur) break;
        ruta.push({ x: cur.x, y: cur.y });
    }

    ruta.reverse();
    return { route: ruta };
}
