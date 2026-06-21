// ייבוא הכלים של Firebase (חיבור למערכת ולמשתמשים)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// המפתחות הייחודיים של הפרויקט שלך שהוצאנו עכשיו
const firebaseConfig = {
    apiKey: "AIzaSyDjjkHCfciK5LRMbF87cJT4Q81-R6YfeRc",
    authDomain: "tavruooa-system.firebaseapp.com",
    projectId: "tavruooa-system",
    storageBucket: "tavruooa-system.firebasestorage.app",
    messagingSenderId: "830671998830",
    appId: "1:830671998830:web:4930fc09f332959089fb7f"
};

// הפעלת החיבור לענן
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ניהול מסכים
const screens = {
    login: document.getElementById('login-screen'),
    worker: document.getElementById('worker-screen'),
    manager: document.getElementById('manager-screen'),
    map: document.getElementById('map-screen')
};

function showScreen(screenKey) {
    Object.keys(screens).forEach(key => screens[key].classList.remove('active'));
    screens[screenKey].classList.add('active');
    if (screenKey === 'map' && map) {
        setTimeout(() => map.invalidateSize(), 200);
    }
}

// לוגיקת התחברות אמיתית מול Firebase
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorText = document.getElementById('login-error');
    
    if (!email || !password) {
        errorText.innerText = "נא להזין אימייל וסיסמה";
        return;
    }

    errorText.innerText = "מתחבר למערכת...";

    // פקודת ההתחברות לענן
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // התחברות הצליחה!
            errorText.innerText = "";
            const user = userCredential.user;
            
            // בדיקה זמנית: אם האימייל מכיל את המילה admin, נפתח את מסך המנהל
            if (user.email.includes('admin')) {
                showScreen('manager');
            } else {
                showScreen('worker');
            }
        })
        .catch((error) => {
            // התחברות נכשלה (סיסמה שגויה או מייל לא קיים)
            console.error("שגיאת התחברות:", error.code);
            errorText.innerText = "פרטי התחברות שגויים. נסה שוב.";
        });
});

// לוגיקת התנתקות אמיתית
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        signOut(auth).then(() => {
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
            showScreen('login');
        });
    });
});

// לחצני מעבר למפה (זהים לקודם)
document.getElementById('map-back-btn').addEventListener('click', () => {
    // בודק אם המשתמש המחובר הוא מנהל או פועל כדי לדעת לאן להחזיר אותו
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email.includes('admin')) {
        showScreen('manager');
    } else {
        showScreen('worker');
    }
});

document.getElementById('worker-start-nav-btn').addEventListener('click', () => {
    document.getElementById('map-action-title').innerText = "מצב ניווט - פועל שטח";
    showScreen('map');
});

document.getElementById('mgr-nav-btn').addEventListener('click', () => {
    document.getElementById('map-action-title').innerText = "מצב ניווט - מנהל";
    showScreen('map');
});

document.getElementById('mgr-record-btn').addEventListener('click', () => {
    document.getElementById('map-action-title').innerText = "מצב הקלטת מסלול חדש";
    showScreen('map');
});

document.getElementById('worker-report-btn').addEventListener('click', () => {
    alert("בשלב הבא נחבר את כפתור הדיווח למצלמה ולענן!");
});

// אתחול מפת Leaflet (עובדת כרגיל)
const map = L.map('map').setView([32.0853, 34.7818], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
