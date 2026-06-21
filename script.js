// חיבור ל-Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// המפתחות שלך מהענן
const firebaseConfig = {
    apiKey: "AIzaSyDjjkHCfciK5LRMbF87cJT4Q81-R6YfeRc",
    authDomain: "tavruooa-system.firebaseapp.com",
    projectId: "tavruooa-system",
    storageBucket: "tavruooa-system.firebasestorage.app",
    messagingSenderId: "830671998830",
    appId: "1:830671998830:web:4930fc09f332959089fb7f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==========================================
// הגדרת מנהל המערכת 
// ==========================================
const MANAGER_EMAIL = "yonigeo2105@gmail.com"; 

const screens = {
    login: document.getElementById('login-screen'),
    worker: document.getElementById('worker-screen'),
    manager: document.getElementById('manager-screen'),
    map: document.getElementById('map-screen')
};

function showScreen(screenKey) {
    Object.keys(screens).forEach(key => screens[key].classList.remove('active'));
    screens[screenKey].classList.add('active');
    
    if (screenKey === 'map' && typeof map !== 'undefined') {
        setTimeout(() => map.invalidateSize(), 200);
    }
}

// התחברות
document.getElementById('login-btn').addEventListener('click', () => {
    let username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const errorText = document.getElementById('login-error');
    
    if (!username || !password) {
        errorText.innerText = "נא להזין שם משתמש וסיסמה";
        return;
    }

    if (!username.includes('@')) {
        username = username + '@tavruooa.com'; 
    }

    errorText.innerText = "מתחבר למערכת...";

    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            errorText.innerText = "";
            const user = userCredential.user;
            
            if (user.email === MANAGER_EMAIL) {
                showScreen('manager');
            } else {
                showScreen('worker');  
            }
        })
        .catch((error) => {
            console.error("שגיאת התחברות:", error.code);
            errorText.innerText = "פרטי התחברות שגויים. נסה שוב.";
        });
});

// התנתקות
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        signOut(auth).then(() => {
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
            showScreen('login');
        });
    });
});

// כפתורי ניווט חזרה לתפריט
document.getElementById('map-back-btn').addEventListener('click', () => {
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === MANAGER_EMAIL) {
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

document.getElementById('worker-report-btn').addEventListener('click', () =>
