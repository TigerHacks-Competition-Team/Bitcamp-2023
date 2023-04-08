<script lang="ts">
    import { onMount } from 'svelte'
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
    import { user } from '../stores'

    onMount(() => user.subscribe(console.log))
 
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