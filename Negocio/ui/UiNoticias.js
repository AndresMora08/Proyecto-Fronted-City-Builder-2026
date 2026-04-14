function renderNewsToUI(item) {
    const list = document.getElementById('news-list');
    const track = document.getElementById('news-track');

    if (!list) return;

    const isDesktop = window.innerWidth > 1024;

    if (isDesktop) {

        // 🔹 Control por clases en lugar de style
        list.classList.remove("modo-mobile");
        list.classList.add("modo-desktop");

        list.innerHTML = `
            <a class="news-card animate-fade-in" href="${item.url}" target="_blank">
                <div class="news-card-media">
                    <img class="news-card-img" src="${item.image}" onerror="this.src='../../Assets/images/placeholder.jpg'">
                </div>
                <div class="news-card-body">
                    <h4 class="news-card-title">${item.title}</h4>
                    <p class="news-card-desc">${item.description}</p>
                    <div class="news-card-footer">
                        <span class="news-card-meta">${item.timestamp} - ${item.source}</span>
                    </div>
                </div>
            </a>`;

    } else {

        // 🔹 Control por clases en lugar de style
        list.classList.remove("modo-desktop");
        list.classList.add("modo-mobile");

        let mobileTrack = track;

        // 🔹 Si el track no existe
        if (!mobileTrack) {
            list.innerHTML = `
                <div class="news-ticker">
                    <div class="news-track" id="news-track"></div>
                </div>`;
            
            mobileTrack = document.getElementById('news-track');
            if (!mobileTrack) return;
        }

        mobileTrack.innerHTML = "";

        requestAnimationFrame(() => {
            mobileTrack.innerHTML = `
                <div class="news-single-item animate">
                    <a class="news-ticker-item important" href="${item.url}" target="_blank">
                        <span class="news-sep">[${item.timestamp}]</span> 
                        <strong>${item.title}</strong> 
                    </a>
                </div>`;
        });
    }
}