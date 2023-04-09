<script lang="ts">
	import "../style/index.scss";
	import Background from "./background.svelte";
</script>

<svelte:head>
	<title>Playright</title>
</svelte:head>

<a href="/login">Login</a>
<a href="/home">Home</a>
<Background id="background" />
<div class="background-fallback" />
