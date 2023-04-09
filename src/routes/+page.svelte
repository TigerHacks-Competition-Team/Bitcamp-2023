<script lang="ts">
	import Navbar from "./navbar.svelte";
	import "../style/index.scss";
	import Background from "./background.svelte";
</script>

<svelte:head>
	<title>Playright</title>
</svelte:head>

<Navbar />
<a href="/login">Login</a>
<a href="/home">Home</a>
<Background id="background" />
