// הגדרת המפה. כברירת מחדל היא תיפתח באזור תל אביב-יפו לפני שה-GPS יאתר אותך
const map = L.map('map').setView([32.0853, 34.7818], 14);

// טעינת ה"אריחים" של המפה (הגרפיקה עצמה) משירות חינמי של OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

let userMarker = null; // משתנה שישמור את הסמן של המשאית/הפועל

// פונקציה שמופעלת בכל פעם שה-GPS קולט מיקום חדש
function updateLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const latlng = [lat, lng];

    // אם הסמן כבר קיים על המפה, פשוט נזיז אותו למיקום החדש
    if (userMarker) {
        userMarker.setLatLng(latlng);
    } else {
        // אם זה המיקום הראשון שנקלט, ניצור סמן חדש
        userMarker = L.marker(latlng).addTo(map);
        userMarker.bindPopup("אתה כאן!").openPopup();
    }

    // ממרכז את המפה סביב המיקום החדש
    map.setView(latlng, 17);
}

// פונקציה במקרה שיש שגיאה בקריאת ה-GPS
function locationError(error) {
    console.warn('שגיאת מיקום:', error.message);
}

// בקשה מהדפדפן להתחיל לעקוב אחרי המיקום באופן רציף
if (navigator.geolocation) {
    // הפקודה watchPosition עוקבת אחרי המיקום גם כשאתה בתנועה
    navigator.geolocation.watchPosition(updateLocation, locationError, {
        enableHighAccuracy: true, // דורש מהמכשיר דיוק מקסימלי (חשוב בשביל הקלטת מסלול מדויק)
        maximumAge: 0,            // אל תשתמש במיקום ישן שנשמר בזיכרון
        timeout: 10000            // זמן המתנה מקסימלי לקליטה במילישניות
    });
} else {
    alert("הדפדפן שלך לא תומך בשירותי מיקום.");
}
