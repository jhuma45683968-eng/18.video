import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ১. আপনার অ্যাডমিন পাসওয়ার্ড
const ADMIN_SECRET_KEY = "lala";

// ২. লগইন ও সিকিউরিটি লজিক (যাতে ডাটাবেজ ছাড়া লগইন কাজ করে)
const loginModal = document.getElementById('loginModal');
const adminPanel = document.getElementById('adminPanel');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

if (loginBtn) {
    if (sessionStorage.getItem('isAdminAuth') === 'true') {
        loginModal.classList.add('hidden');
        adminPanel.classList.remove('hidden');
    }

    loginBtn.addEventListener('click', () => {
        const pass = document.getElementById('adminPasswordInput').value;
        if (pass === ADMIN_SECRET_KEY) {
            sessionStorage.setItem('isAdminAuth', 'true');
            loginModal.classList.add('hidden');
            adminPanel.classList.remove('hidden');
        } else {
            document.getElementById('loginError').innerText = "Incorrect Admin Password!";
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminAuth');
        window.location.reload();
    });
}

// ৩. ফায়ারবেস কনফিগারেশন 
// (ভবিষ্যতে এখানে আপনার ফায়ারবেসের আসল কোড বসাবেন)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ৪. ডাটাবেজ কানেকশন এবং এরর হ্যান্ডেলিং (যাতে সাইট ক্র্যাশ না করে)
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {
    console.warn("Firebase is not configured properly yet. Forms will not save data.");
}

// ৫. হোম পেজের ভিডিও লোডিং লজিক
if (db && document.getElementById('videoGrid')) {
    loadDynamicBanner();
    loadVideoGallery();
}

async function loadVideoGallery() {
    const grid = document.getElementById('videoGrid');
    try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        if (querySnapshot.empty) {
            grid.innerHTML = `<p class="loading-text">No videos uploaded yet.</p>`;
            return;
        }
        grid.innerHTML = "";
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const card = document.createElement('div');
            card.className = 'video-card';
            card.innerHTML = `
                <div class="thumbnail-container">
                    <img src="${data.thumbnail}" alt="Thumbnail">
                    <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
                </div>
                <div class="video-info">
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                </div>
            `;
            card.addEventListener('click', () => window.location.href = data.telegramLink);
            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = `<p class="loading-text">Database connected but unable to fetch videos.</p>`;
    }
}

async function loadDynamicBanner() {
    const container = document.getElementById('dynamicBannerContainer');
    try {
        const bannerDoc = await getDoc(doc(db, "settings", "liveBanner"));
        if (bannerDoc.exists()) {
            const data = bannerDoc.data();
            container.innerHTML = "";
            let mediaElement = data.type === 'video' ? document.createElement('video') : document.createElement('img');
            mediaElement.src = data.url;
            mediaElement.className = 'banner-media';
            if(data.type === 'video') { mediaElement.autoplay = true; mediaElement.muted = true; mediaElement.loop = true; mediaElement.playsInline = true; }
            container.appendChild(mediaElement);
            container.onclick = () => window.location.href = data.telegramLink;
        } else {
            container.innerHTML = `<div class="banner-placeholder"><p>No active banner set.</p></div>`;
        }
    } catch (e) {}
}

// ৬. অ্যাডমিন প্যানেল ফর্ম সাবমিট লজিক
if (loginBtn) {
    document.getElementById('videoUploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!db) return alert("Firebase ডাটাবেজ কানেক্ট করা নেই! আগে script.js ফাইলে API Key বসান।");
        
        const saveBtn = document.getElementById('saveVideoBtn');
        saveBtn.innerText = "Saving to Cloud...";
        try {
            await addDoc(collection(db, "videos"), {
                title: document.getElementById('videoTitle').value,
                description: document.getElementById('videoDesc').value,
                thumbnail: document.getElementById('videoThumb').value,
                telegramLink: document.getElementById('videoTelegramLink').value,
                createdAt: new Date()
            });
            alert("ভিডিও সফলভাবে আপলোড হয়েছে!");
            document.getElementById('videoUploadForm').reset();
        } catch (err) { alert("আপলোড ব্যর্থ হয়েছে।"); } 
        finally { saveBtn.innerText = "Save Video to Cloud"; }
    });

    document.getElementById('bannerUploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!db) return alert("Firebase ডাটাবেজ কানেক্ট করা নেই! আগে script.js ফাইলে API Key বসান।");
        
        const bannerBtn = document.getElementById('saveBannerBtn');
        bannerBtn.innerText = "Updating Banner...";
        try {
            await setDoc(doc(db, "settings", "liveBanner"), {
                type: document.getElementById('bannerType').value,
                url: document.getElementById('bannerUrl').value,
                telegramLink: document.getElementById('bannerTelegramLink').value
            });
            alert("ব্যানার সফলভাবে আপডেট হয়েছে!");
            document.getElementById('bannerUploadForm').reset();
        } catch (err) { alert("ব্যানার আপডেট ব্যর্থ হয়েছে।"); } 
        finally { bannerBtn.innerText = "Update Live Banner"; }
    });
}
