function obtenerMejorPuntoConexion(mapa, origen, destino) {
    const { x: ox, y: oy } = origen;
    const { x: dx, y: dy } = destino;
    const direcciones = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let mejorPunto = null;
    let distanciaMinima = Infinity;

    if (mapa[ox] && mapa[ox][oy] === 1) return [ox, oy];

    direcciones.forEach(([bx, by]) => {
        const nx = ox + bx;
        const ny = oy + by;
        if (mapa[nx] && mapa[nx][ny] === 1) {
            const distancia = Math.abs(nx - dx) + Math.abs(ny - dy);
            if (distancia < distanciaMinima) {
                distanciaMinima = distancia;
                mejorPunto = [nx, ny];
            }
        }
    });
    return mejorPunto || [ox, oy];
}

async function calcularRuta(mapa, origen, destino) {
    const puntoInicio = obtenerMejorPuntoConexion(mapa, origen, destino);
    const puntoFin = obtenerMejorPuntoConexion(mapa, destino, origen);

    const payload = {
        map: mapa,          
        start: puntoInicio,  
        end: puntoFin      
    };

    console.log("Enviando a Python:", payload);

    try {
        const respuesta = await fetch("http://127.0.0.1:5000/api/calculate-route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            console.error("Error Backend:", data.error);
            alert(data.error); 
            return { route: [] };
        }

        const rutaFinal = data.route.map(coord => ({
            x: coord[0],
            y: coord[1]
        }));

        console.log("Ruta calculada por Python:", rutaFinal);
        return { route: rutaFinal };

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Asegúrate de que main.py esté corriendo en el puerto 5000");
        return { route: [] };
    }
}