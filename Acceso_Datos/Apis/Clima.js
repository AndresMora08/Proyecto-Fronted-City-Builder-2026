const OPENWEATHER_API_KEY = (window.API_KEYS && window.API_KEYS.OPENWEATHER) || "";

const obtenerClima = async (lat, lon) => {
    if (!OPENWEATHER_API_KEY) {
        console.warn("OPENWEATHER_API_KEY no configurada.");
        return null;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`;

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error en la peticion");

        const datos = await respuesta.json();

        return {
            temperatura: datos.main.temp,
            estadoPrincipal: datos.weather[0].main, 
            descripcion: datos.weather[0].description,
            humedad: datos.main.humidity,
            viento: (datos.wind.speed * 3.6).toFixed(2)
        };
    } catch (error) {
        console.error("Hubo un problema con el clima:", error);
        return null;
    }
};

async function obtenerCoordenadasCiudad(nombreCiudad, region) {
    const nombre = (nombreCiudad || "").trim();
    const regionLimpia = (region || "").trim();

    if (!nombre && !regionLimpia) return null;

    if (!OPENWEATHER_API_KEY) {
        console.warn("OPENWEATHER_API_KEY no configurada.");
        return null;
    }

    const consultas = [];
    const pushUnico = (valor) => {
        const v = (valor || "").trim();
        if (!v) return;
        if (!consultas.includes(v)) consultas.push(v);
    };

    const nombreTieneComa = nombre.includes(",");
    const regionTieneComa = regionLimpia.includes(",");

    if (nombre) {
        if (nombreTieneComa) {
            pushUnico(nombre);
        } else if (regionLimpia) {
            pushUnico(`${nombre},${regionLimpia}`);
            pushUnico(nombre);
            pushUnico(regionLimpia);
            pushUnico(`${regionLimpia},${nombre}`);
        } else {
            pushUnico(nombre);
        }
    } else if (regionLimpia) {
        pushUnico(regionLimpia);
    }

    if (regionLimpia && regionTieneComa && !consultas.includes(regionLimpia)) {
        pushUnico(regionLimpia);
    }

    for (let i = 0; i < consultas.length; i++) {
        const consulta = consultas[i];
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(consulta)}&limit=1&appid=${OPENWEATHER_API_KEY}`;

        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) throw new Error("Error en la petición de geocoding");
            const resultados = await respuesta.json();
            if (!Array.isArray(resultados) || resultados.length === 0) continue;

            const resultado = resultados[0];
            return {
                lat: resultado.lat,
                lon: resultado.lon,
                nombre: resultado.name,
                pais: resultado.country,
                estado: resultado.state || ""
            };
        } catch (error) {
            console.error("Hubo un problema con la geocodificación:", error);
            return null;
        }
    }

    return null;
}

function actualizarUIClima(datos) {
    if (!datos) return;

    document.getElementById('climaTemp').textContent = `${Math.round(datos.temperatura)}°C`;
    document.getElementById('climaCondicion').textContent = datos.descripcion;
    document.getElementById('climaHumedad').textContent = `${datos.humedad}%`;
    document.getElementById('climaViento').textContent = `${datos.viento} km/h`;

    const contenedor = document.getElementById('widgetClima');
    if (contenedor) {
        contenedor.setAttribute('data-clima', datos.estadoPrincipal);
    }
}

