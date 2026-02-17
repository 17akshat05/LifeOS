import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDlxm_8sv7BHzddWQlVgyGo1VvXtAyWxG4",
    authDomain: "lifeos-7ce24.firebaseapp.com",
    projectId: "lifeos-7ce24",
    storageBucket: "lifeos-7ce24.firebasestorage.app",
    messagingSenderId: "898752263197",
    appId: "1:898752263197:web:511d29cb6e8e4dcb68c2f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
