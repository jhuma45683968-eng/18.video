import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// ১. আপনার ফায়ারবেস কনফিগারেশন এখানে বসান
// ==========================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ২. অ্যাডমিন পাসওয়ার্ড
const ADMIN_SECRET_KEY = "lala";

// ৩. ইনিশিয়ালাইজেশন ও সিকিউরিটি
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (error) {
    console.warn("Firebase configuration is missing or invalid.");
}

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

// ৪. হোম পেজে ভিডিও ও ব্যানার লোড করার লজিক
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
        grid.innerHTML = `<p class="loading-text">Error fetching videos from cloud.</p>`;
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
            if(data.type === 'video') { 
                mediaElement.autoplay = true; 
                mediaElement.muted = true; 
                mediaElement.loop = true; 
                mediaElement.playsInline = true; 
            }
            container.appendChild(mediaElement);
            container.onclick = () => window.location.href = data.telegramLink;
        } else {
            container.innerHTML = `<div class="banner-placeholder"><p>No active banner set.</p></div>`;
        }
    } catch (e) {
        console.error("Banner load error:", e);
    }
}

// ৫. গ্যালারি ফাইলকে বেসসিক্স (Base64) এ রূপান্তর করার ফাংশন
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// ৬. অ্যাডমিন প্যানেল থেকে আপলোড সাবমিট লজিক
if (loginBtn) {
    // ভিডিও আপলোড ফর্ম
    document.getElementById('videoUploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!db) {
            alert("সতর্কতা: ফায়ারবেস কনফিগারেশন সেটআপ করা নেই! দয়া করে script.js এ আপনার ফায়ারবেস API Key বসান।");
            return;
        }
        
        const saveBtn = document.getElementById('saveVideoBtn');
        saveBtn.innerText = "Processing & Saving...";

        try {
            const fileInput = document.getElementById('videoThumbFile').files[0];
            if (!fileInput) throw new Error("কোনো ফাইল সিলেক্ট করা হয়নি!");

            const base64Thumbnail = await convertFileToBase64(fileInput);

            await addDoc(collection(db, "videos"), {
                title: document.getElementById('videoTitle').value,
                description: document.getElementById('videoDesc').value,
                thumbnail: base64Thumbnail,
                telegramLink: document.getElementById('videoTelegramLink').value,
                createdAt: new Date()
            });

            alert("ভিডিও সফলভাবে ক্লাউডে আপলোড হয়েছে!");
            document.getElementById('videoUploadForm').reset();
        } catch (err) { 
            console.error(err);
            alert("আপলোড ব্যর্থ হয়েছে। ফাইলের সাইজ অনেক বড় হতে পারে অথবা ফায়ারবেস রুলস সমস্যা করছে।"); 
        } finally { 
            saveBtn.innerText = "Save Video to Cloud"; 
        }
    });

    // লাইভ ব্যানার আপলোড ফর্ম
    document.getElementById('bannerUploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!db) {
            alert("সতর্কতা: ফায়ারবেস কনফিগারেশন সেটআপ করা নেই! দয়া করে script.js এ আপনার ফায়ারবেস API Key বসান।");
            return;
        }
        
        const bannerBtn = document.getElementById('saveBannerBtn');
        bannerBtn.innerText = "Processing Banner...";

        try {
            const fileInput = document.getElementById('bannerFile').files[0];
            if (!fileInput) throw new Error("কোনো মিডিয়া ফাইল সিলেক্ট করা হয়নি!");

            const base64Media = await convertFileToBase64(fileInput);
            const type = document.getElementById('bannerType').value;

            await setDoc(doc(db, "settings", "liveBanner"), {
                type: type,
                url: base64Media,
                telegramLink: document.getElementById('bannerTelegramLink').value
            });

            alert("লাইভ ব্যানার সফলভাবে আপডেট হয়েছে!");
            document.getElementById('bannerUploadForm').reset();
        } catch (err) { 
            console.error(err);
            alert("ব্যানার আপডেট ব্যর্থ হয়েছে। ফাইলের সাইজ ছোট রাখুন।"); 
        } finally { 
            bannerBtn.innerText = "Update Live Banner"; 
        }
    });
}
