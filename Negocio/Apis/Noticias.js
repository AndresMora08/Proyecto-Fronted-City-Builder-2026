const NEWS_CONFIG = {
    apiKey: clave,
    country: 'co',
    lastUpdate: null
};

const RSS_SOURCES = [
    { name: 'El Tiempo', url: 'https://www.eltiempo.com/rss/colombia.xml' },
    { name: 'El Espectador', url: 'https://www.elespectador.com/rss/colombia/' },
    { name: 'Caracol', url: 'https://www.caracol.com.co/rss/colombia/' },
    { name: 'RCN', url: 'https://www.rcnradio.com/feeds/tema/colombia' }
];

async function fetchRegionalNews() {
    try {
        const data = await solicitarNoticiasColombia();

        if (data.articles) {
            renderNewsBoard(data.articles);
            NEWS_CONFIG.lastUpdate = new Date();
            console.log("Noticias actualizadas:", NEWS_CONFIG.lastUpdate.toLocaleTimeString());
        } else if (data.message) {
            renderNewsBoard([], data.message);
        } else {
            renderNewsBoard([], "Sin noticias por ahora.");
        }
    } catch (error) {
        console.error("Error cargando noticias:", error);
        renderNewsBoard([], "No se pudo cargar noticias.");
    }
}

async function solicitarNoticiasColombia() {
    // 1) Intentar NewsAPI top-headlines
    const newsApi = await solicitarTopHeadlinesCO();
    if (newsApi.articles && newsApi.articles.length > 0) {
        return newsApi;
    }

    // 2) Fallback a RSS locales (sin API key)
    const rssArticles = await solicitarRssColombia();
    if (rssArticles.length > 0) {
        return { articles: rssArticles };
    }

    return { articles: [], message: newsApi.message || "Sin noticias por ahora." };
}

async function solicitarTopHeadlinesCO() {
    const params = new URLSearchParams({
        country: NEWS_CONFIG.country,
        pageSize: '8',
        apiKey: NEWS_CONFIG.apiKey
    });

    const targetUrl = `https://newsapi.org/v2/top-headlines?${params.toString()}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) {
        if (response.status === 426) {
            return { articles: [], message: "NewsAPI no permite peticiones desde navegador (Plan Gratis)." };
        }
        return { articles: [], message: `HTTP ${response.status}` };
    }

    const rawText = await response.text();
    let data = null;

    try {
        data = JSON.parse(rawText);
    } catch (error) {
        return { articles: [], message: "Respuesta no valida del proxy de noticias." };
    }

    if (data.status && data.status !== "ok") {
        return { articles: [], message: data.message || "Servicio no disponible." };
    }

    if (!Array.isArray(data.articles)) {
        return { articles: [], message: "Respuesta sin articulos." };
    }

    // Normalizamos a { title, url }
    const normalized = data.articles
        .map(a => ({ title: a.title || '', url: a.url || '' }))
        .filter(a => a.title);

    return { articles: normalized };
}

async function solicitarRssColombia() {
    const results = [];

    for (const fuente of RSS_SOURCES) {
        try {
            const items = await fetchRss(fuente.url);
            for (const it of items) {
                results.push(it);
            }
        } catch (error) {
            console.warn("RSS fallido:", fuente.name, error);
        }
    }

    // Deduplicar por titulo
    const seen = new Set();
    const unique = [];
    for (const a of results) {
        if (!a.title) continue;
        const key = a.title.trim().toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(a);
        if (unique.length >= 12) break;
    }

    return unique;
}

async function fetchRss(rssUrl) {
    const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`,
        `https://r.jina.ai/http://${rssUrl.replace(/^https?:\/\//, '')}`
    ];

    let lastError = null;
    let xmlText = null;

    for (const proxyUrl of proxyUrls) {
        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            xmlText = await response.text();
            if (xmlText && xmlText.trim().length > 0) {
                break;
            }
        } catch (error) {
            lastError = error;
        }
    }

    if (!xmlText) {
        throw lastError || new Error("No se pudo obtener RSS.");
    }

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(xml.querySelectorAll("item"));

    return items
        .map(item => ({
            title: (item.querySelector("title")?.textContent || '').trim(),
            url: (item.querySelector("link")?.textContent || '').trim()
        }))
        .filter(a => a.title);
}

let newsRotationTimer = null;
const NEWS_SCROLL_SPEED_PX_PER_SEC = 90;

function startNewsRotation(items) {
    const container = document.getElementById('news-list');
    if (!container) return;

    if (newsRotationTimer) {
        clearTimeout(newsRotationTimer);
        newsRotationTimer = null;
    }

    let index = 0;

    container.innerHTML = `
        <div class="news-ticker-single">
            <a class="news-ticker-item news-single-item animate" target="_blank"></a>
        </div>
    `;

    const itemEl = container.querySelector('.news-single-item');

    const updateItem = () => {
        const item = items[index];
        itemEl.textContent = item.title;

        if (item.url) {
            itemEl.setAttribute('href', item.url);
            itemEl.setAttribute('target', '_blank');
            itemEl.classList.remove('news-no-link');
        } else {
            itemEl.removeAttribute('href');
            itemEl.removeAttribute('target');
            itemEl.classList.add('news-no-link');
        }

        requestAnimationFrame(() => {
            const containerWidth = container.getBoundingClientRect().width;
            const itemWidth = itemEl.getBoundingClientRect().width;
            const startX = containerWidth;
            const endX = -(itemWidth + containerWidth);
            const distance = startX - endX;
            const durationMs = Math.max(6000, Math.round((distance / NEWS_SCROLL_SPEED_PX_PER_SEC) * 1000));

            itemEl.style.setProperty('--news-start', `${startX}px`);
            itemEl.style.setProperty('--news-end', `${endX}px`);
            itemEl.style.setProperty('--news-item-duration', `${durationMs}ms`);

            itemEl.classList.remove('animate');
            void itemEl.offsetWidth;
            itemEl.classList.add('animate');

            newsRotationTimer = setTimeout(updateItem, durationMs);
        });

        index = (index + 1) % items.length;
    };

    updateItem();
}

function renderNewsBoard(articles, mensajeVacio) {
    const container = document.getElementById('news-list');
    if (!container) return;

    container.innerHTML = '';

    if (!articles || articles.length === 0) {
        const mensaje = mensajeVacio || "Sin noticias por ahora.";
        container.innerHTML = `<span class="news-empty">${mensaje}</span>`;
        return;
    }

    const items = articles
        .slice(0, 8)
        .map(a => {
            const href = a.url ? `href="${a.url}" target="_blank"` : '';
            return `<a class="news-ticker-item" ${href}>${a.title}</a>`;
        });

    if (items.length === 0) {
        container.innerHTML = '<span class="news-empty">Sin noticias por ahora.</span>';
        return;
    }

    startNewsRotation(
        articles.slice(0, 8).map(a => ({ title: a.title, url: a.url }))
    );
}

// Iniciar actualizacion
document.addEventListener("DOMContentLoaded", () => {
    fetchRegionalNews();
    setInterval(fetchRegionalNews, 1800000); // 30 minutos
});
