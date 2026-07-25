import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const ADMIN_SECRET_KEY = "lala";

let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {}

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
            document.getElementById('loginError').innerText = "Incorrect Password!";
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminAuth');
        window.location.reload();
    });
}

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
        grid.innerHTML = `<p class="loading-text">Error fetching videos.</p>`;
    }
}

async function loadDynamicBanner() {
    const container = document.getElementById('dynamicBannerContainer');
    try {
        const bannerDoc = await getDoc(doc(db, "settings", "liveBanner"));
        if (bannerDoc.exists()) {
            const data = bannerDoc.data();
            container.innerHTML = "";
            let mediaElement = document.createElement('img');
            mediaElement.src = data.url;
            mediaElement.className = 'banner-media';
            container.appendChild(mediaElement);
            container.onclick = () => window.location.href = data.telegramLink;
        } else {
            container.innerHTML = `<div class="banner-placeholder"><p>No active banner set.</p></div>`;
        }
    } catch (e) {}
}

const videoForm = document.getElementById('videoUploadForm');
if (videoForm) {
    videoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!db) return alert("Firebase connected নাই!");

        const saveBtn = document.getElementById('saveVideoBtn');
        saveBtn.innerText = "Saving...";

        try {
            const imageName = document.getElementById('videoThumbName').value.trim();
            await addDoc(collection(db, "videos"), {
                title: document.getElementById('videoTitle').value,
                description: document.getElementById('videoDesc').value,
                thumbnail: imageName,
                telegramLink: document.getElementById('videoTelegramLink').value,
                createdAt: new Date()
            });

            alert("ভিডিও সফলভাবে সেভ হয়েছে!");
            videoForm.reset();
        } catch (err) {
            alert("সেভ করতে সমস্যা হয়েছে।");
        } finally {
            saveBtn.innerText = "Save Video to Cloud";
        }
    });
}

const bannerForm = document.getElementById('bannerUploadForm');
if (bannerForm) {
    bannerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!db) return alert("Firebase connected নাই!");

        const bannerBtn = document.getElementById('saveBannerBtn');
        bannerBtn.innerText = "Updating...";

        try {
            const bannerName = document.getElementById('bannerFileName').value.trim();
            await setDoc(doc(db, "settings", "liveBanner"), {
                url: bannerName,
                telegramLink: document.getElementById('bannerTelegramLink').value
            });

            alert("লাইভ ব্যানার সফলভাবে আপডেট হয়েছে!");
            bannerForm.reset();
        } catch (err) {
            alert("ব্যানার আপডেট ব্যর্থ হয়েছে।");
        } finally {
            bannerBtn.innerText = "Update Live Banner";
        }
    });
}
