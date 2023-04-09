<script lang="ts">
	import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";
	import { onMount } from "svelte";
	import { app } from "../stores";
	import Background from "../background.svelte";
	import { goto } from "$app/navigation";

	let url: string | null = null;
	const db = getFirestore(app);

	function generateRandomString(length: number) {
		let result = "";
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	}

	onMount(() => {
		const input = document.getElementById("link") as HTMLElement;
		setInterval(() => {
			const id = generateRandomString(11);
			input.setAttribute("placeholder", "https://www.youtube.com/watch?v=" + id);
		}, 1000);
	});

	async function chooseSong() {
		const q = query(collection(db, "songs"), where("url", "==", url));
		const querySnapshot = await getDocs(q);
		const docs : any[] = [];
		querySnapshot.forEach(doc => {
			docs.push(doc);
		});
		if (docs.length == 0) {
			await addDoc(collection(db, "songs"), { url: url });
            alert("Adding song. Please enter URL in a few minutes.");
		} else {
            let id = docs[0].data().original.split("/")[1];
            goto(`/home/song/${id}`);
        }
	}
</script>

<span id="background"> <Background /> </span>
<form id="center" on:submit={chooseSong}>
	<h1 class="title is-1 has-text-centered main">Learn a song</h1>
	<div class="underlined">
		<input
			id="link"
			type="text"
			name="url"
			class="input clean-input underlined"
			bind:value={url}
			placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
	</div>
	<button class="clean-button has-text-centered" type="submit">Play</button>
</form>

<style lang="scss">
	#background {
		position: absolute;
		inset: 0;
		z-index: -1000;
	}
	#center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		input {
			text-align: center;
			width: 39ch;
		}
		button {
			width: 100%;
		}
	}
</style>
