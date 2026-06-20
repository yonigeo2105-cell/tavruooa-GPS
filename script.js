const map = L.map('map').setView([32.0853, 34.7818], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

let userMarker = null;
let isRecording = false;    // האם אנחנו באמצע הקלטה כרגע?
let recordedRoute = [];     // רשימת קואורדינטות של המסלול שהוקלט
let routePolyline = null;   // הקו האדום שיוצג על המפה

// חיבור ללחצנים מה-HTML
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');

// לחיצה על התחלת הקלטה
startBtn.addEventListener('click', () => {
    isRecording = true;
    recordedRoute = []; // איפוס מסלול קודם
    
    // אם יש קו ישן על המפה, נמחק אותו
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }
    
    // יצירת קו אדום חדש וריק על המפה
    routePolyline = L.polyline([], { color: 'red', weight: 5 }).addTo(map);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    alert("ההקלטה החלה! סע במסלול הרצוי.");
});

// לחיצה על עצירת הקלטה
stopBtn.addEventListener('click', () => {
    isRecording = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    
    alert(`ההקלטה הסתיימה! נשמרו ${recordedRoute.length} נקודות ציון במסלול.`);
    console.log("המסלול שהוקלט:", recordedRoute); 
    // בשלב הבא נלמד איך לשלוח את המערך הזה לבסיס נתונים בענן
});

function updateLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const latlng = [lat, lng];

    // עדכון המיקום הנוכחי של המשתמש
    if (userMarker) {
        userMarker.setLatLng(latlng);
    } else {
        userMarker = L.marker(latlng).addTo(map);
    }

    // אם אנחנו במצב הקלטה, נוסיף את הנקודה למסלול ונצייר אותה
    if (isRecording) {
        recordedRoute.push(latlng);          // מוסיף את הנקודה לרשימה
        routePolyline.setLatLngs(recordedRoute); // מעדכן את הקו האדום על המפה
    }

    map.setView(latlng, 17);
}

function locationError(error) {
    console.warn('שגיאת מיקום:', error.message);
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateLocation, locationError, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
    });
} else {
    alert("הדפדפן שלך לא תומך בשירותי מיקום.");
}
