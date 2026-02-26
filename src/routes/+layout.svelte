<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import CampusTitleBar from '$lib/components/page/CampusTitleBar.svelte';
	import { page } from '$app/state';
	import { onMount, type Snippet } from 'svelte';
	import iosPWASplash from 'ios-pwa-splash';

	let { children }: { children: Snippet } = $props();

	onMount(() => {
		if (
			/iPhone/i.test(navigator.userAgent) &&
			!window.matchMedia('(display-mode: standalone)').matches
		) {
			iosPWASplash('/splash-icon.png', '#15191E');
		}

		const onVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				check_needs_reload();
			}
		};

		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	});

	const reloadInterval = 60 * 60 * 1000; // 1 hour in milliseconds
	const start = Date.now();
	function check_needs_reload() {
		const now = Date.now();
		const diff = now - start;
		if (diff > reloadInterval) {
			location.reload();
		}
	}
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
	<div class="flex min-h-dvh flex-col">
		<CampusTitleBar />
		<main class="flex-1">
			{@render children()}
		</main>
	</div>
{/if}
