<script lang="ts">
	import Navbar from "./navbar.svelte";
	import "../style/index.scss";
	import Background from "./background.svelte";
</script>

<svelte:head>
	<title>Playright</title>
</svelte:head>

<span id="background"><Background /></span>
<Navbar />

<!-- <a href="/login">Login</a> -->
<!-- <a href="/home">Home</a> -->

<div class="section is-thin">
	<h1 class="title is-1 main">Learning Piano.</h1>
	<h1 class="title is-1 is-special main">One Key at a Time.</h1>
	<h3 class="subtitle is-3 main">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tellus sapien, ornare non faucibus
		vitae, elementum nec nunc.
	</h3>
</div>

<div class="section is-thin">
	<h1 class="title is-1 has-text-centered">
		Learning the piano is hard. <span class="is-special">Seriously.</span>
	</h1>
	<h3 class="subtitle is-4 has-text-centered">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tellus sapien, ornare non faucibus
		vitae, elementum nec nunc.
	</h3>
</div>

<div class="section is-thin">
	<div class="columns is-desktop">
		<div class="column">
			<img src="/img/demo-temp.png" alt="Demo" id="demo" />
		</div>
		<div class="column">
			<h1 class="title is-1">Text here</h1>
			<h3 class="subtitle is-4">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Sed pulvinar proin gravida hendrerit lectus a. Id diam vel
				quam elementum. Rhoncus mattis rhoncus urna neque viverra justo nec. Sodales ut etiam sit
				amet nisl. Purus in mollis nunc sed id semper risus. Curabitur vitae nunc sed velit. Erat
				pellentesque adipiscing commodo elit at. Semper risus in hendrerit gravida rutrum quisque
				non tellus orci. Suscipit adipiscing bibendum est ultricies integer. Vel pretium lectus quam
				id leo in vitae. Lorem ipsum dolor sit amet consectetur. Senectus et netus et malesuada
				fames.
			</h3>
			<div class="dots">
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
			<use xlink:href="#gentle-wave" x="48" y="0" stroke="rgba(0,0,0,0.7)" fill="transparent" />
			<use xlink:href="#gentle-wave" x="48" y="3" stroke="rgba(0,0,0,0.5)" fill="transparent" />
			<use xlink:href="#gentle-wave" x="48" y="5" stroke="rgba(0,0,0,0.3)" fill="transparent" />
			<use xlink:href="#gentle-wave" x="48" y="7" stroke="rgba(0,0,0,1)" fill="transparent" />
		</g>
	</svg>
</div>

<div id="fancy-footer">
	<span id="footer-bg"><Background /></span>
	<div id="get-started">
		<div class="corners" />
		<h1 class="title is-1 has-text-centered is-special main">Get Started</h1>
		<div id="get-started-input">
			<input type="text" class="input clean-input" placeholder="Enter your email..." />
			<button>GO</button>
		</div>
	</div>
	<div class="footer">
		<div class="columns">
			<div class="column">
				<h1 class="title is-1 is-special">Playright</h1>
				<h3 class="subtitle is-3">Lorem ipsum dolor sit amet.</h3>
			</div>
			<div class="column">
				<p>
					Built with <a href="https://svelte.dev">Svelte</a>, <a href="https://bulma.io">Bulma</a>,
					& <a href="https://threejs.org">Three.js</a>
				</p>
				<p>
					Powered by with <a href="https://firebase.google.com">Firebase</a>,
					<a href="https://cloud.google.com/kubernetes-engine/">Google Cloud Kubernetes Engine</a>,
					<a href="https://github.com/deezer/spleeter">Spleeter</a>, &
					<a href="https://basicpitch.spotify.com/">Basic Pitch</a>
				</p>
			</div>
		</div>
	</div>
</div>
