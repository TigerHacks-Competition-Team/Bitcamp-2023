import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { writable } from "svelte/store";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: "bitcamp-2023.firebaseapp.com",
    projectId: "bitcamp-2023",
    storageBucket: "bitcamp-2023.appspot.com",
    messagingSenderId: "674372391347",
    appId: "1:674372391347:web:30a95f426d836031a2fbc6"
};

const app = initializeApp(firebaseConfig);
export const user = writable(getAuth().currentUser)

getAuth().onAuthStateChanged((u) => {
    user.set(u)
});