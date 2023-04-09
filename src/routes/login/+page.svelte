<script lang="ts">
	import {
		createUserWithEmailAndPassword,
		getAuth,
		signInWithEmailAndPassword,
	} from "firebase/auth";
	import { onMount } from "svelte";
	import Background from "./../background.svelte";

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

<span id="background"><Background /></span>
<div id="login">
	<h1 class="title is-1 has-text-centered main">Log In</h1>
	<div class="underlined">
		<input type="email" class="input clean-input underlined" placeholder="Email">
	</div>
	<div class="underlined">
		<input type="password" class="input clean-input underlined" placeholder="Password">
	</div>
	<button class="clean-button has-text-centered">GO</button>
</div>

<!-- <input type="email" bind:value={email} />
<input type="password" bind:value={password} />
<button on:click={addUser}>Submit</button>
<button on:click={logout}>Logout</button>
<button on:click={login}>Login</button> -->

<style lang="scss">
	@import "../../style/vars";

	#background {
		position: absolute;
		inset: 0;
		z-index: -1000;
	}

	#login {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		input {
			margin-top: 0.25em;
		}
		button {
			margin-top: 0.5em;
			width: 100%;
		}
	}
</style>
