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
	<CampusTitleBar />
	<main class="flex-1 space-y-6 p-4 pt-6">
		{@render children()}
	</main>
</div>
