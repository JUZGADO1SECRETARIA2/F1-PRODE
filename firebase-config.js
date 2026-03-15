// Este archivo contiene la configuración de Firebase
// Firebase te permitirá guardar los datos de los 5 amigos gratis sin necesidad de pagar un servidor.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// ====== ATENCIÓN: INSTRUCCIONES ======
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un proyecto nuevo (Gratis)
// 3. Añade una App "Web" (el ícono de código </>)
// 4. Copia el objeto "firebaseConfig" que te dan y pégalo aquí abajo reemplazando el de ejemplo:
// 5. Ve a "Realtime Database" en el menú izquierdo, crea una base de datos.
// 6. Ve a las "Reglas" de la base de datos y pon: { ".read": true, ".write": true } (Solo porque son 5 amigos en privado, para no complicar con logins).

const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Initialize Firebase solo si se cambió la config por defecto
let app, db;

if (firebaseConfig.apiKey !== "TU_API_KEY_AQUI") {
    try {
        app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        console.log("Firebase conectado exitosamente.");
    } catch (e) {
        console.error("Error conectando a Firebase:", e);
    }
} else {
    console.warn("Firebase no está configurado. Usando modo Local de Prueba.");
    // Aquí puedes enlazar con la lógica mock de logic.js
}

export { db, ref, set, onValue, get };
