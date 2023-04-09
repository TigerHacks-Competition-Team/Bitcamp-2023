<script lang="ts">
	import { onMount } from "svelte";

	onMount(() => {
		const button = document.getElementById("navbar-button");
		button?.addEventListener("click", () => {
			button.classList.toggle("is-active");
			button.parentElement?.parentElement?.children[1]?.classList.toggle("is-active");
			// toggle is-inactive on the main navbar because even though it's not in bulma, that way
			// I can add custom styles to make the entire thing have a bg
			// it's inactive instead of active because it needs to have the style by default, or
			// else A11Y yells at me and it doesn't work
			button.parentElement?.parentElement?.classList.toggle("is-inactive");
		});
	});
</script>

<nav class="navbar is-inactive" id="navbar">
	<div class="navbar-brand">
		<a href="/" class="navbar-item">Playright</a>
		<!-- svelte-ignore a11y-missing-attribute -->
		<a
			class="navbar-burger"
			role="button"
			aria-label="menu"
			aria-expanded="false"
			id="navbar-button">
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</a>
	</div>

	<div id="navbar-contents" class="navbar-menu">
		<div class="navbar-end">
			<a href="#about" class="navbar-item">About</a>
            <a href="/login" class="navbar-item">Log In</a>
			<div class="navbar-item">
				<a href="/signup" class="simple-button">Sign Up</a>
			</div>
		</div>
	</div>
</nav>

<style lang="scss">
	@use "bulma/sass/utilities/all" as defaults;
	@import "../style/vars";

	// navbar
	#navbar {
		font-family: $family-secondary;

		// links
		a {
			font-size: 1.25em;
			color: $text-light;

			&.simple-button {
				color: $primary;
			}
		}
		// main title
		.navbar-brand a:first-child {
			font-size: 2em;
			font-weight: bold;
			color: $secondary;
		}

		&:not(.is-inactive) {
			background-color: rgba(0, 0, 0, 0.1);
			// use box shadow to fade out background
			.navbar-menu {
				box-shadow: 0px 50px 50px 0px rgba(0, 0, 0, 0.1);
			}
		}

		// make burger bigger
		.navbar-burger span {
			height: 2px;
			width: 20px;

			&:nth-child(1) {
				top: calc(50% - 8px);
			}
			&:nth-child(3) {
				top: calc(50% + 6px);
			}
		}
        // make bigger burger work in 'x' form
        .navbar-burger.is-active span {
            &:nth-child(1) {
                transform: translateY(7px) rotate(45deg)
            }
            &:nth-child(3) {
                transform: translateY(-7px) rotate(-45deg)
            }
        }
	}
</style>
