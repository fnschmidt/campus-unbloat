<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import CampusTitleBar from '$lib/components/page/CampusTitleBar.svelte';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if page.route.id === '/'}
	<div class="flex min-h-dvh flex-col">
		<div class="flex min-h-dvh flex-col">
			<CampusTitleBar />
			<main class="flex flex-1 flex-col justify-center">
				{@render children?.()}
			</main>
		</div>
	</div>
{:else}
	<div class="flex min-h-dvh flex-col bg-base-300">
		<CampusTitleBar />
		<main class="flex-1 space-y-6 p-4 pt-6">
			{@render children()}
		</main>
	</div>
{/if}
