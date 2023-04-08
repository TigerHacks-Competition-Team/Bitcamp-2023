import { initializeApp } from "firebase/app";
import { getAuth, type User } from 'firebase/auth';
import { writable, type Writable } from "svelte/store";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: "bitcamp-2023.firebaseapp.com",
    projectId: "bitcamp-2023",
    storageBucket: "bitcamp-2023.appspot.com",
    messagingSenderId: "674372391347",
    appId: "1:674372391347:web:30a95f426d836031a2fbc6"
};

const app = initializeApp(firebaseConfig);
const _user = writable(getAuth().currentUser)

getAuth().onAuthStateChanged((u) => {
    _user.set(u)
});

export const user = _user