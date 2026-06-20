const map = L.map('map').setView([32.0853, 34.7818], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

let userMarker = null;
let isRecording = false;
let recordedRoute = [];
let routePolyline = null;

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const statusBar = document.getElementById('status-bar');

// עדכון טקסט בשורת הסטטוס
function updateStatus(text, isError = false) {
    statusBar.innerText = text;
    if (isError) {
        statusBar.style.color = '#ff4d4d'; // אדום לשגיאה
    } else {
        statusBar.style.color = '#f1c40f'; // צהוב רגיל
    }
}

startBtn.addEventListener('click', () => {
    isRecording = true;
    recordedRoute = [];
    
    if (routePolyline) { map.removeLayer(routePolyline); }
    routePolyline = L.polyline([], { color: 'red', weight: 6 }).addTo(map);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    updateStatus("הקלטה פעילה! בתנועה יצוירו קווים.");
});

stopBtn.addEventListener('click', () => {
    isRecording = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    updateStatus(`ההקלטה נעצרה. נשמרו ${recordedRoute.length} נקודות.`);
    alert(`המסלול נשמר מקומית עם ${recordedRoute.length} נקודות.`);
});

function updateLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy; // דיוק ה-GPS במטרים
    const latlng = [lat, lng];

    // עדכון הסיכה על המפה
    if (userMarker) {
        userMarker.setLatLng(latlng);
    } else {
        userMarker = L.marker(latlng).addTo(map);
        userMarker.bindPopup("המשאית כאן").openPopup();
    }

    // אם מקליטים, דוחפים את הנקודה לקו
    if (isRecording) {
        recordedRoute.push(latlng);
        routePolyline.setLatLngs(recordedRoute);
        updateStatus(`מקליט... קלטתי ${recordedRoute.length} נקודות (רמת דיוק: ${Math.round(accuracy)} מטר)`);
    } else {
        updateStatus(`GPS מחובר. רמת דיוק: ${Math.round(accuracy)} מטר.`);
    }

    map.setView(latlng, 17);
}

function locationError(error) {
    let errorMsg = "שגיאת GPS: ";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMsg += "נא לאשר גישה למיקום בהגדרות הטלפון/דפדפן.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMsg += "מיקום לא זמין (נסה לצאת למקום פתוח).";
            break;
        case error.TIMEOUT:
            errorMsg += "הזמן לקבלת מיקום פג (אות חלש).";
            break;
        default:
            errorMsg += error.message;
    }
    updateStatus(errorMsg, true);
}

// הפעלת המעקב
if (navigator.geolocation) {
    updateStatus("מנסה להתחבר ללווייני GPS...");
    navigator.geolocation.watchPosition(updateLocation, locationError, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
    });
} else {
    updateStatus("הדפדפן לא תומך ב-GPS", true);
}
