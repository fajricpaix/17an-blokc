import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// Konfigurasi web Firebase (bukan rahasia — aman berada di kode).
const firebaseConfig = {
  apiKey: "AIzaSyCbwkruZR6UWLfpvWvGVbB5QaYHCTU1Qco",
  authDomain: "sl-blokc.firebaseapp.com",
  databaseURL: "https://sl-blokc-default-rtdb.firebaseio.com",
  projectId: "sl-blokc",
  storageBucket: "sl-blokc.firebasestorage.app",
  messagingSenderId: "454522849628",
  appId: "1:454522849628:web:efab3e635bf6cda73a1999",
  measurementId: "G-HES2MFYNQM",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const rtdb = getDatabase(app);
