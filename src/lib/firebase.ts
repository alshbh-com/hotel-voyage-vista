
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDVwLER-g5AL8TH52Go2sTEbS7O-HwaimE",
  authDomain: "mahjooz-aca56.firebaseapp.com",
  projectId: "mahjooz-aca56",
  storageBucket: "mahjooz-aca56.firebasestorage.app",
  messagingSenderId: "339972782124",
  appId: "1:339972782124:web:49dabf8ed86f0ebfae3989",
  measurementId: "G-49LJS40ZG2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
