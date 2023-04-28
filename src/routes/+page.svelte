<script lang="ts">
	import Navbar from "./navbar.svelte";
	import "../style/index.scss";
	import Background from "./background.svelte";
	import { onMount } from "svelte";

	let email: string;

	function rotatePiano() {
		const piano = document.getElementById("piano") as HTMLElement;
		let rise = window.innerHeight - (0.75 * window.innerHeight - 0.2 * window.innerWidth);
		let run = window.innerWidth;
		piano.style.transform = `rotateZ(${Math.atan(rise / run) * -(180 / Math.PI)}deg)`;
	}

	onMount(() => {
		const piano = document.getElementById("piano") as HTMLElement;
		piano.style.top = `calc(55vh - 20vw)`;
		piano.style.right = `-10%`;
		rotatePiano();
		window.addEventListener("resize", rotatePiano);
	});
</script>

<svelte:head>
	<title>Playright</title>
</svelte:head>

<span id="background"><Background /></span>
<Navbar />
<img src="/img/piano.png" alt="" id="piano" />

<div class="section is-thin">
	<h1 class="title is-1 main">Learning Piano.</h1>
	<h1 class="title is-1 is-special main">One Key at a Time.</h1>
	<h3 class="subtitle is-3 main">
		Learning with Playright is easy and fun. Just drop in a song and play away!
	</h3>
</div>

<div class="section is-thin" id="about">
	<h1 class="title is-1 has-text-centered">
		Learning the piano is hard. <span class="is-special">Seriously.</span>
	</h1>
	<h3 class="subtitle is-4 has-text-centered">
		With Playright, we try to make it as simple as possible to learn and enjoy the songs you love.
	</h3>
</div>

<div class="section is-thin">
	<div class="columns is-desktop">
		<div class="column">
			<img src="/img/demo-temp.png" alt="Demo" id="demo" />
		</div>
		<div class="column">
			<h1 class="title is-1">State of the art</h1>
			<h3 class="subtitle is-4">
				Playright uses machine learning based on Deezer's <b>Spleeter</b> algorithm to split any
				song into the tracks that make it up. Then, we use Spotify's <b>Basic Pitch</b> algorithm to
				generate a MIDI (piano notes) from the piano. Then, we play it back as a game, creating an engaging
				learning experience.
			</h3>
			<div class="dots">
				<span />
				<span />
				<span />
			</div>
			<h1 class="title is-1 has-text-right">Play your way</h1>
			<h3 class="subtitle is-4 has-text-right">
				We use songs from YouTube's extensive library, letting you play along with any song you
				want. This makes your sessions more memorable, helping Playright become an effective tool.
			</h3>
			<div class="dots" style="float: right">
				<span />
				<span />
				<span />
			</div>
		</div>
	</div>
</div>

<div class="divider">
	<svg
		class="waves"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		viewBox="0 24 150 28"
		preserveAspectRatio="none"
		shape-rendering="auto">
		<defs>
			<path
				id="gentle-wave"
				d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
		</defs>
		<g class="parallax">
			<use
				xlink:href="#gentle-wave"
				x="48"
				y="0"
				stroke="rgba(255,255,255,0.7)"
				fill="transparent" />
			<use
				xlink:href="#gentle-wave"
				x="48"
				y="3"
				stroke="rgba(255,255,255,0.5)"
				fill="transparent" />
			<use
				xlink:href="#gentle-wave"
				x="48"
				y="5"
				stroke="rgba(255,255,255,0.3)"
				fill="transparent" />
			<use xlink:href="#gentle-wave" x="48" y="7" stroke="rgba(255,255,255,1)" fill="transparent" />
		</g>
	</svg>
</div>

<div id="fancy-footer">
	<span id="footer-bg"><Background /></span>
	<div id="get-started">
		<div class="corners" />
		<h1 class="title is-1 has-text-centered is-special main">Get Started</h1>
		<div id="get-started-input">
			<input
				type="text"
				class="input clean-input"
				placeholder="Enter your email..."
				bind:value={email} />
			<button on:click={() => (window.location.href += "signup?email=" + encodeURIComponent(email))}
				>GO</button>
		</div>
	</div>
	<div class="footer">
		<div class="columns">
			<div class="column">
				<h1 class="title is-1 is-special">Playright</h1>
				<h3 class="subtitle is-3">Learning piano. One key at a time.</h3>
			</div>
			<div class="column">
				<p>
					Built with <a href="https://svelte.dev">Svelte</a>, <a href="https://bulma.io">Bulma</a>,
					& <a href="https://threejs.org">Three.js</a>
				</p>
				<p>
					Powered by <a href="https://firebase.google.com">Firebase</a>,
					<a href="https://cloud.google.com/kubernetes-engine/">Google Cloud Kubernetes Engine</a>,
					<a href="https://github.com/deezer/spleeter">Spleeter</a>, &
					<a href="https://basicpitch.spotify.com/">Basic Pitch</a>
				</p>
			</div>
		</div>
	</div>
</div>
