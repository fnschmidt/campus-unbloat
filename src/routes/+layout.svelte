<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import CampusTitleBar from '$lib/components/page/CampusTitleBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-dvh flex-col">
	<div class="flex min-h-dvh flex-col">
		<CampusTitleBar />
		<main class="flex flex-1 flex-col justify-center">
			{@render children?.()}
		</main>
	</div>
</div>
