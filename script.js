// Import Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// TODO: PASTE YOUR FIREBASE CONFIGURATION HERE
// ==========================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin Password (updated to 'lala')
const ADMIN_SECRET_KEY = "lala";

// --- INDEX.HTML LOGIC ---
if (document.getElementById('videoGrid')) {
    loadDynamicBanner();
    loadVideoGallery();
}

async function loadVideoGallery() {
    const grid = document.getElementById('videoGrid');
    try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        if (querySnapshot.empty) {
            grid.innerHTML = `<p class="loading-text">No videos uploaded yet. Visit Admin panel to add content.</p>`;
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
            // Instant redirect to Telegram link
            card.addEventListener('click', () => {
                window.location.href = data.telegramLink;
            });
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading videos:", error);
        grid.innerHTML = `<p class="loading-text">Error connecting to cloud database.</p>`;
    }
}

async function loadDynamicBanner() {
    const container = document.getElementById('dynamicBannerContainer');
    try {
        const bannerDoc = await getDoc(doc(db, "settings", "liveBanner"));
        if (bannerDoc.exists()) {
            const data = bannerDoc.data();
            container.innerHTML = "";
            
            let mediaElement;
            if (data.type === 'video') {
                mediaElement = document.createElement('video');
                mediaElement.src = data.url;
                mediaElement.autoplay = true;
                mediaElement.muted = true;
                mediaElement.loop = true;
                mediaElement.playsInline = true;
                mediaElement.className = 'banner-media';
            } else {
                mediaElement = document.createElement('img');
                mediaElement.src = data.url;
                mediaElement.className = 'banner-media';
            }

            container.appendChild(mediaElement);
            container.onclick = () => {
                window.location.href = data.telegramLink;
            };
        } else {
            container.innerHTML = `<div class="banner-placeholder"><p>No active banner set.</p></div>`;
        }
    } catch (e) {
        console.error("Error loading banner:", e);
    }
}

// --- ADMIN.HTML LOGIC ---
const loginModal = document.getElementById('loginModal');
const adminPanel = document.getElementById('adminPanel');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

if (loginBtn) {
    // Check if already logged in during session
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

    // Handle Video Upload Form Submission
    document.getElementById('videoUploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('saveVideoBtn');
        saveBtn.innerText = "Saving to Cloud...";

        const title = document.getElementById('videoTitle').value;
        const description = document.getElementById('videoDesc').value;
        const thumbnail = document.getElementById('videoThumb').value;
        const telegramLink = document.getElementById('videoTelegramLink').value;

        try {
            await addDoc(collection(db, "videos"), {
                title,
                description,
                thumbnail,
                telegramLink,
                createdAt: new Date()
            });
            alert("Video uploaded successfully to Firebase cloud database!");
            document.getElementById('videoUploadForm').reset();
        } catch (err) {
            console.error(err);
            alert("Failed to upload video.");
        } finally {
            saveBtn.innerText = "Save Video to Cloud";
        }
    });

    // Handle Banner Upload Form Submission
    document.getElementById('bannerUploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const bannerBtn = document.getElementById('saveBannerBtn');
        bannerBtn.innerText = "Updating Banner...";

        const type = document.getElementById('bannerType').value;
        const url = document.getElementById('bannerUrl').value;
        const telegramLink = document.getElementById('bannerTelegramLink').value;

        try {
            await setDoc(doc(db, "settings", "liveBanner"), {
                type,
                url,
                telegramLink
            });
            alert("Live banner updated successfully!");
            document.getElementById('bannerUploadForm').reset();
        } catch (err) {
            console.error(err);
            alert("Failed to update banner.");
        } finally {
            bannerBtn.innerText = "Update Live Banner";
        }
    });
}
