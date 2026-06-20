// ניהול המסכים באפליקציה
const screens = {
    login: document.getElementById('login-screen'),
    worker: document.getElementById('worker-screen'),
    manager: document.getElementById('manager-screen'),
    map: document.getElementById('map-screen')
};

// פונקציה למעבר בין מסכים
function showScreen(screenKey) {
    Object.keys(screens).forEach(key => {
        screens[key].classList.remove('active');
    });
    screens[screenKey].classList.add('active');
    
    // אם עוברים למסך המפה, יש לוודא שהמפה מעודכנת ומחשבת את הגודל שלה מחדש
    if (screenKey === 'map' && map) {
        setTimeout(() => map.invalidateSize(), 200);
    }
}

// לוגיקת כניסה סימולטיבית
document.getElementById('login-btn').addEventListener('click', () => {
    const user = document.getElementById('username').value.trim().toLowerCase();
    const errorText = document.getElementById('login-error');
    
    if (user === 'admin') {
        errorText.innerText = "";
        showScreen('manager');
    } else if (user === 'worker') {
        errorText.innerText = "";
        showScreen('worker');
    } else {
        errorText.innerText = "שם משתמש שגוי! (הקש admin או worker)";
    }
});

// התנתקות
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('username').value = "";
        showScreen('login');
    });
});

// ניווט מהמפה חזרה לתפריט הקודם לפי סוג המשתמש
document.getElementById('map-back-btn').addEventListener('click', () => {
    const user = document.getElementById('username').value.trim().toLowerCase();
    showScreen(user === 'admin' ? 'manager' : 'worker');
});

// לחצני כניסה למפה
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
    alert("הפעלת מצלמה ודיווח תקלה (פיצ'ר זה יחובר בשלב הבא)");
});

// אתחול מפת Leaflet בסיסית ברקע
const map = L.map('map').setView([32.0853, 34.7818], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);
