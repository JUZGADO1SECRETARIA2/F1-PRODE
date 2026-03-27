// Configuración Firebase - F1 Prode
// =============================================
// INSTRUCCIONES (una sola vez):
// 1. Ir a https://console.firebase.google.com/
// 2. Crear un proyecto nuevo (ej: "f1-prode")
// 3. Build → Realtime Database → Crear base de datos → modo Locked → Crear
// 4. Reglas → reemplazar con: { "rules": { ".read": true, ".write": true } } → Publicar
// 5. Configuración del proyecto (engranaje) → Tus apps → Agregar app Web (</>)
// 6. Copiar el firebaseConfig y pegarlo acá abajo reemplazando los valores de ejemplo
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC-Q7GCXlcXaC-sBSOB7RqfRvgaPz-x9DQ",
    authDomain: "f1-prode-f5929.firebaseapp.com",
    databaseURL: "https://f1-prode-f5929-default-rtdb.firebaseio.com",
    projectId: "f1-prode-f5929",
    storageBucket: "f1-prode-f5929.firebasestorage.app",
    messagingSenderId: "657658228626",
    appId: "1:657658228626:web:cf3a6b86509e90c63c9b4b"
};

let db = null;

if (firebaseConfig.apiKey !== "TU_API_KEY_AQUI") {
    try {
        const app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        console.log("✅ Firebase conectado.");
    } catch (e) {
        console.error("❌ Error conectando Firebase:", e);
    }
} else {
    console.warn("⚠️ Firebase no configurado. Pegá tu firebaseConfig en firebase-config.js");
}

export { db, ref, set, get, onValue, update };
