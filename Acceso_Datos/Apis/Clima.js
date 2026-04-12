const OPENWEATHER_API_KEY = (window.API_KEYS && window.API_KEYS.OPENWEATHER) || "";

const buscarSugerenciasGeo = async (texto) => {
    if (!texto || texto.length < 3 || !OPENWEATHER_API_KEY) return [];

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(texto)}&limit=5&appid=${OPENWEATHER_API_KEY}`;

    try {
        const respuesta = await fetch(url);
        const ciudades = await respuesta.json();
        // Devolvemos un formato amigable: "Ciudad, Estado, Pais"
        return ciudades.map(c => ({
            descripcion: `${c.name}${c.state ? ', ' + c.state : ''}, ${c.country}`,
            lat: c.lat,
            lon: c.lon
        }));
    } catch (error) {
        console.error("Error en sugerencias:", error);
        return [];
    }
};

async function obtenerCoordenadasCiudad(region) {
    if (!region || !OPENWEATHER_API_KEY) return null;

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(region)}&limit=1&appid=${OPENWEATHER_API_KEY}`;

    try {
        const respuesta = await fetch(url);
        const resultados = await respuesta.json();
        return resultados.length > 0 ? resultados[0] : null;
    } catch (error) {
        console.error("Error buscando coordenadas:", error);
        return null;
    }
}

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


function actualizarUIClima(datos) {
    if (!datos) return;

    document.getElementById('climaTemp').textContent = `${Math.round(datos.temperatura)}°C`;
    document.getElementById('climaCondicion').textContent = datos.descripcion;
    document.getElementById('climaHumedad').textContent = `${datos.humedad}%`;
    document.getElementById('climaViento').textContent = `${datos.viento} km/h`;

    const iconos = {
        Thunderstorm: "⛈️",
        Drizzle: "🌦️",
        Rain: "🌧️",
        Clear: "☀️",
        Clouds: "☁️"
    };

    const iconoEl = document.getElementById("climaIcono");
    if (iconoEl) {
        iconoEl.textContent = iconos[datos.estadoPrincipal] || "🌡️";
    }

    const contenedor = document.getElementById('widgetClima');
    if (contenedor) {
        contenedor.setAttribute('data-clima', datos.estadoPrincipal);
    }
}
