<script lang="ts">
	import Navbar from "./navbar.svelte";
	import "../style/index.scss";
	import Background from "./background.svelte";
</script>

<svelte:head>
	<title>Playright</title>
</svelte:head>

<Navbar />

<!-- <a href="/login">Login</a> -->
<!-- <a href="/home">Home</a> -->
<Background id="background" />

<div class="section is-thin">
	<h1 class="title is-1 main">Learning Piano.</h1>
	<h1 class="title is-1 is-special main">One Key at a Time.</h1>
	<h3 class="subtitle is-3 main">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tellus sapien, ornare non faucibus
		vitae, elementum nec nunc.
	</h3>
</div>
