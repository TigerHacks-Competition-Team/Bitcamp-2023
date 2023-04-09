<script lang="ts">
	import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
	import Background from "../background.svelte";
	import { page } from "$app/stores";

	let email: string | null = $page.url.searchParams.get("email");
	let password: string;

	async function signUp() {
		const auth = getAuth();
		await createUserWithEmailAndPassword(auth, email as string, password);
	}
</script>

<span id="background"><Background /></span>
<div id="login">
	<h1 class="title is-1 has-text-centered main">Sign Up</h1>
	<div class="underlined">
		<input
			type="email"
			class="input clean-input underlined"
			placeholder="Email"
			bind:value={email} />
	</div>
	<div class="underlined">
		<input
			type="password"
			class="input clean-input underlined"
			placeholder="Password"
			bind:value={password} />
	</div>
	<button class="clean-button has-text-centered" on:click={signUp}>GO</button>
</div>

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
