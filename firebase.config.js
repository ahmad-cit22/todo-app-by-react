import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDbxemKcQiKLFVgo5kdDiP6uVsOw0sePLs",
    authDomain: "test-to-do-app-cf1ac.firebaseapp.com",
    projectId: "test-to-do-app-cf1ac",
    storageBucket: "test-to-do-app-cf1ac.appspot.com",
    messagingSenderId: "166436622992",
    appId: "1:166436622992:web:f4cab00930321be6eefe15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;