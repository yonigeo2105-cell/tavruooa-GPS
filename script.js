body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: Arial, sans-serif;
}

#map {
    height: 100vh;
    width: 100vw;
    z-index: 1;
}

/* מיקום תיבת הלחצנים מעל המפה */
#controls-container {
    position: absolute;
    top: 15px;
    left: 5%;
    right: 5%;
    z-index: 1000; /* מספר גבוה כדי שיצוף מעל המפה */
    display: flex;
    gap: 10px;
}

/* עיצוב כללי ללחצנים - גדולים וקריאים לשטח */
.btn {
    flex: 1;
    padding: 15px 10px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    text-align: center;
}

.start {
    background-color: #2ecc71;
    color: white;
}

.stop {
    background-color: #e74c3c;
    color: white;
}

/* עיצוב ללחצן כבוי */
.btn:disabled {
    background-color: #95a5a6;
    color: #7f8c8d;
    cursor: not-allowed;
    box-shadow: none;
}
