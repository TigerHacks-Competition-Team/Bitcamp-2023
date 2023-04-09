<script lang="ts">
	import { onMount } from "svelte";
	import {
		getAuth,
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
	} from "firebase/auth";
	import { user } from "../stores";

	onMount(() => console.log(getAuth().currentUser));

	let email: string;
	let password: string;

	function addUser() {
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				const user = userCredential.user;
			})
			.catch(console.log);
	}

	function login() {
		const auth = getAuth();
		signInWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				const user = userCredential.user;
			})
			.catch(console.log);
	}

	function logout() {
		getAuth().signOut();
	}
</script>

<input type="email" bind:value={email} />
<input type="password" bind:value={password} />
<button on:click={addUser}>Submit</button>
<button on:click={logout}>Logout</button>
<button on:click={login}>Login</button>
