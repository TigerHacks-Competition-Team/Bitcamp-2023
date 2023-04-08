<script lang="ts">
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
    import { initializeApp } from "firebase/app";

    const firebaseConfig = {
        apiKey: import.meta.env.VITE_APIKEY,
        authDomain: "bitcamp-2023.firebaseapp.com",
        projectId: "bitcamp-2023",
        storageBucket: "bitcamp-2023.appspot.com",
        messagingSenderId: "674372391347",
        appId: "1:674372391347:web:30a95f426d836031a2fbc6"
    };

    const app = initializeApp(firebaseConfig);

    let email : string;
    let password : string;

    function addUser() {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                
                console.log(errorCode, errorMessage)
            });
    }
</script>

<input type="email" bind:value={email}/>
<input type="password" bind:value={password}/>
<button on:click={addUser}>Submit</button>