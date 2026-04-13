// Acceso_Datos/Apis/Noticias.js

const NEWS_CONFIG = {
    updateInterval: 1800000, 
    rotationInterval: 15000,  
    rssSource: "https://www.eltiempo.com/rss/colombia.xml"
};

let lastNewsItems = [];
let currentIndex = 0;
let rotationTimer = null;

function updateTickerDuration() {
    const newsListEl = document.getElementById('news-list');
    if (!newsListEl || lastNewsItems.length === 0) return;
    const durationSeconds = (NEWS_CONFIG.rotationInterval / 1000) * lastNewsItems.length;
    newsListEl.style.setProperty('--news-ticker-duration', `${durationSeconds}s`);
}

async function fetchRegionalNews() {
    try {
        const targetUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(NEWS_CONFIG.rssSource)}`;
        const response = await fetch(targetUrl);
        const data = await response.json();

        if (data.status === 'ok' && data.items) {
            lastNewsItems = data.items.slice(0, 5).map(item => ({
                title: item.title || '',
                description: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 85) + "..." : '',
                url: item.link || '#',
                image: item.enclosure?.link || item.thumbnail || "",
                source: "EL TIEMPO",
                timestamp: new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));

            currentIndex = 0;
            startNewsRotation();
            updateTickerDuration();
        }
    } catch (error) {
        console.error("Error obteniendo noticias regionales:", error);
    }
}

function startNewsRotation() {
    if (lastNewsItems.length === 0) return;
    if (rotationTimer) clearInterval(rotationTimer);

    const rotate = () => {
        const item = lastNewsItems[currentIndex];
        // LLAMADA A LA UI 
        if (typeof renderNewsToUI === 'function') {
            renderNewsToUI(item, lastNewsItems);
        }
        currentIndex = (currentIndex + 1) % lastNewsItems.length;
    };

    rotate();
    updateTickerDuration();
    rotationTimer = setInterval(rotate, NEWS_CONFIG.rotationInterval);
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    fetchRegionalNews();
    setInterval(fetchRegionalNews, NEWS_CONFIG.updateInterval);
});

// Soporte para Responsive sin perder la noticia actual
window.addEventListener('resize', () => {
    if (lastNewsItems.length > 0) {
        const prevIndex = (currentIndex === 0) ? lastNewsItems.length - 1 : currentIndex - 1;
        renderNewsToUI(lastNewsItems[prevIndex], lastNewsItems);
        updateTickerDuration();
    }
});
