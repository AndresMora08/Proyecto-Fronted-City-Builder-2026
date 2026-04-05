const NEWS_CONFIG = {
    apiKey: (window.API_KEYS && window.API_KEYS.NEWSAPI) || "",
    country: 'co',
    lastUpdate: null
};

const RSS_SOURCES = [
    { name: 'El Tiempo', url: 'https://www.eltiempo.com/rss/colombia.xml' },
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
    // Intentar NewsAPI top-headlines
    const newsApi = await solicitarTopHeadlinesCO();
    if (newsApi.articles && newsApi.articles.length > 0) {
        return newsApi;
    }

    // Fallback a RSS locales (sin API key)
    const rssArticles = await solicitarRssColombia();
    if (rssArticles.length > 0) {
        return { articles: rssArticles };
    }

    return { articles: [], message: newsApi.message || "Sin noticias por ahora." };
}

async function solicitarTopHeadlinesCO() {
    if (!NEWS_CONFIG.apiKey) {
        return { articles: [], message: "NewsAPI key no configurada." };
    }
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

    const normalized = data.articles
        .map(a => ({
            title: a.title || '',
            url: a.url || '',
            image: a.urlToImage || '',
            source: (a.source && a.source.name) ? a.source.name : ''
        }))
        .filter(a => a.title);

    return { articles: normalized };
}

async function solicitarRssColombia() {
    const results = [];

    for (const fuente of RSS_SOURCES) {
        try {
            const items = await fetchRss(fuente.url, fuente.name);
            for (const it of items) {
                results.push(it);
            }
        } catch (error) {
            console.warn("RSS fallido:", fuente.name, error);
        }
    }

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

async function fetchRss(rssUrl, sourceName) {
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

    const extractFirstImgFromHtml = (html) => {
        if (!html) return '';
        try {
            const doc = new DOMParser().parseFromString(html, "text/html");
            const img = doc.querySelector("img");
            return img ? (img.getAttribute("src") || '') : '';
        } catch {
            return '';
        }
    };

    const pickImageFromItem = (item) => {
        const mediaContent = item.querySelector('media\\:content')?.getAttribute('url') || '';
        if (mediaContent) return mediaContent;

        const mediaThumb = item.querySelector('media\\:thumbnail')?.getAttribute('url') || '';
        if (mediaThumb) return mediaThumb;

        const enclosure = item.querySelector('enclosure');
        if (enclosure) {
            const type = enclosure.getAttribute('type') || '';
            const url = enclosure.getAttribute('url') || '';
            if (url && type.startsWith('image/')) return url;
        }

        const contentEncoded = item.querySelector('content\\:encoded')?.textContent || '';
        const fromContent = extractFirstImgFromHtml(contentEncoded);
        if (fromContent) return fromContent;

        const description = item.querySelector('description')?.textContent || '';
        const fromDesc = extractFirstImgFromHtml(description);
        if (fromDesc) return fromDesc;

        return '';
    };

    return items
        .map(item => ({
            title: (item.querySelector("title")?.textContent || '').trim(),
            url: (item.querySelector("link")?.textContent || '').trim(),
            image: pickImageFromItem(item),
            source: sourceName || ''
        }))
        .filter(a => a.title);
}

let newsRotationTimer = null;
const NEWS_ROTATION_MS = 9000;
const NEWS_SCROLL_SPEED_PX_PER_SEC = 90;
const NEWS_PLACEHOLDER_IMAGE = "../../Assets/images/istockphoto-2191688361-255x253.jpg";
let lastNewsItems = [];
const NEWS_IMAGE_PROXY = (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;

function normalizeImageUrl(url) {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    // Remove protocol for proxy to avoid mixed-content issues
    const withoutProto = trimmed.replace(/^https?:\/\//, "");
    return NEWS_IMAGE_PROXY(withoutProto);
}

function startNewsTicker(items) {
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

function startNewsCard(items) {
    const container = document.getElementById('news-list');
    if (!container) return;

    if (newsRotationTimer) {
        clearInterval(newsRotationTimer);
        newsRotationTimer = null;
    }

    let index = 0;

    container.innerHTML = `
        <a class="news-card" id="news-card" target="_blank" rel="noopener">
            <div class="news-card-media">
                <img class="news-card-img" alt="Imagen de noticia">
            </div>
            <div class="news-card-body">
                <div class="news-card-title"></div>
                <div class="news-card-desc"></div>
            </div>
            <div class="news-card-footer">
                <div class="news-card-meta"></div>
            </div>
        </a>
    `;

    const cardEl = container.querySelector('#news-card');
    const titleEl = container.querySelector('.news-card-title');
    const descEl = container.querySelector('.news-card-desc');
    const metaEl = container.querySelector('.news-card-meta');
    const imgEl = container.querySelector('.news-card-img');

    imgEl.addEventListener('error', () => {
        imgEl.setAttribute('src', NEWS_PLACEHOLDER_IMAGE);
    });

    const updateItem = () => {
        const item = items[index];
        titleEl.textContent = item.title || 'Sin titulo';
        if (descEl) {
            descEl.textContent = item.description || '';
        }
        metaEl.textContent = item.source ? `Fuente: ${item.source}` : '';

        if (item.url) {
            cardEl.setAttribute('href', item.url);
            cardEl.classList.remove('news-no-link');
        } else {
            cardEl.removeAttribute('href');
            cardEl.classList.add('news-no-link');
        }

        const imageUrl = normalizeImageUrl(item.image);
        if (imageUrl) {
            cardEl.classList.remove('no-image');
            imgEl.setAttribute('src', imageUrl);
        } else {
            cardEl.classList.remove('no-image');
            imgEl.setAttribute('src', NEWS_PLACEHOLDER_IMAGE);
        }

        index = (index + 1) % items.length;
    };

    updateItem();
    newsRotationTimer = setInterval(updateItem, NEWS_ROTATION_MS);
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

    const items = articles.slice(0, 8).map(a => ({
        title: a.title,
        url: a.url,
        image: a.image || '',
        source: a.source || ''
    }));

    lastNewsItems = items;
    renderNewsByViewport();
}

function renderNewsByViewport() {
    if (!lastNewsItems || lastNewsItems.length === 0) return;
    const isDesktop = window.matchMedia && window.matchMedia('(min-width:1025px)').matches;
    if (isDesktop) {
        startNewsCard(lastNewsItems);
    } else {
        startNewsTicker(lastNewsItems);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchRegionalNews();
    setInterval(fetchRegionalNews, 1800000); // 30 minutos
});

if (window.matchMedia) {
    const mq = window.matchMedia('(min-width:1025px)');
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', renderNewsByViewport);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(renderNewsByViewport);
    }
}