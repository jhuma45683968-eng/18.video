import { allVideosBanners } from "./banners.js";

function loadAllVideosGallery() {
    const gridContainer = document.getElementById('videoGalleryGrid');
    if (!gridContainer) return;

    if (allVideosBanners && allVideosBanners.length > 0) {
        gridContainer.innerHTML = "";

        allVideosBanners.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'video-card';
            
            card.innerHTML = `
                <div class="thumbnail-container">
                    <img src="${item.imageName}" alt="Thumbnail">
                    <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
                </div>
                <div class="video-info">
                    <h3>${item.title}</h3>
                </div>
            `;

            // ব্যানারে বা কার্ডে ক্লিক করলে নির্দিষ্ট টেলিগ্রাম লিংকে চলে যাবে
            card.addEventListener('click', () => {
                window.location.href = item.telegramLink;
            });

            gridContainer.appendChild(card);
        });
    } else {
        gridContainer.innerHTML = `<p class="loading-text">কোনো ভিডিও ব্যানার পাওয়া যায়নি।</p>`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadAllVideosGallery();
});
