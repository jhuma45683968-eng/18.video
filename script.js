const allVideosBanners = [
    {
        imageName: "IMG_20260725_141801_602.jpg",
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ১",
        telegramLink: "https://t.me/s2PIkZvtaT5lNmY1/3"
    },
    {
        imageName: "IMG_20260725_195719_596.jpg",
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ২",
        telegramLink: "https://t.me/Adult_Zone_01_Official/4"
    },
    {
        imageName: "IMG_20260725_195743_656.jpg",
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ৩",
        telegramLink: "https://t.me/AdultZone01_Real/4"
    },
    {
        imageName: "IMG_20260725_195807_798.jpg",
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ৪",
        telegramLink: "https://t.me/Adult_Zone_01_BD/4"
    },
    {
        imageName: "IMG_20260725_195828_609.jpg",
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ৫",
        telegramLink: "https://t.me/AdultZone01_Channel/4"
    }
];

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
                    <img src="${item.imageName}" alt="Thumbnail" onerror="this.onerror=null; this.src='https://via.placeholder.com/600x300?text=Image+Not+Found';">
                </div>
                <div class="video-info">
                    <h3>${item.title}</h3>
                </div>
            `;

            card.addEventListener('click', () => {
                window.location.href = item.telegramLink;
            });

            gridContainer.appendChild(card);
        });
    } else {
        gridContainer.innerHTML = `<p class="loading-text" style="text-align:center; padding:20px; color:#aaa;">কোনো ভিডিও ব্যানার পাওয়া যায়নি।</p>`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadAllVideosGallery();
});
