const allVideosBanners = [
    {
        mediaName: "IMG_20260725_141801_602.jpg", // চাইলে এখানে .mp4 ভিডিও বা .jpg ছবি দিতে পারেন
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ১",
        telegramLink: "https://t.me/s2PIkZvtaT5lNmY1/3"
    },
    {
        mediaName: "IMG_20260725_195719_596.jpg", 
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ২",
        telegramLink: "https://t.me/Adult_Zone_01_Official/4"
    },
    {
        mediaName: "IMG_20260725_195743_656.jpg", 
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ৩",
        telegramLink: "https://t.me/AdultZone01_Real/4"
    },
    {
        mediaName: "IMG_20260725_195807_798.jpg", 
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ৪",
        telegramLink: "https://t.me/Adult_Zone_01_BD/4"
    },
    {
        mediaName: "IMG_20260725_195828_609.jpg", 
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ৫",
        telegramLink: "https://t.me/AdultZone01_Channel/4"
    },
    {
        mediaName: "VID_20260725_204648_879.mp4", 
        title: "সেরা সব নতুন এডাল ভিডিও দেখতে নিয়মিত আমাদের প্রিমিয়াম সাইটে যোগ দিন 🔞 - ৬",
        telegramLink: "https://t.me/Official_Adult_Zone_01/4?single"
    }
    // ভবিষ্যতে আরও নতুন ভিডিও বা ব্যানার যোগ করতে চাইলে ঠিক একইভাবে নিচে নিচে কমা দিয়ে বসিয়ে দেবেন
];

function loadAllVideosGallery() {
    const gridContainer = document.getElementById('videoGalleryGrid');
    if (!gridContainer) return;

    if (allVideosBanners && allVideosBanners.length > 0) {
        gridContainer.innerHTML = "";

        allVideosBanners.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'video-card';
            
            let mediaHtml = "";
            // ফাইলের নামের শেষে .mp4 থাকলেই সেটি লাইভ ভিডিও হিসেবে অটো-লুপ হবে
            if (item.mediaName.toLowerCase().endsWith('.mp4')) {
                mediaHtml = `<video src="${item.mediaName}" autoplay muted loop playsinline preload="auto"></video>`;
            } else {
                // অন্যথায় সেটি সাধারণ ছবি বা ব্যানার হিসেবে শো করবে
                mediaHtml = `<img src="${item.mediaName}" alt="Thumbnail">`;
            }

            card.innerHTML = `
                <div class="thumbnail-container">
                    ${mediaHtml}
                </div>
                <div class="video-info">
                    <h3>${item.title}</h3>
                </div>
            `;

            // ক্লিক করলেই নির্দিষ্ট টেলিগ্রাম লিংকে নিয়ে যাবে
            card.addEventListener('click', () => {
                window.location.href = item.telegramLink;
            });

            gridContainer.appendChild(card);
        });
    } else {
        gridContainer.innerHTML = `<p class="loading-text" style="text-align:center; padding:20px; color:#aaa;">কোনো কনটেন্ট পাওয়া যায়নি।</p>`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadAllVideosGallery();
});
