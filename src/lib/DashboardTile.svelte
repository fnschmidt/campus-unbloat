<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	// import { ProgressRadial } from '@skeletonlabs/skeleton';

	import TileInteractiveElementWrapper from './TilesAndModals/TileInteractiveElementWrapper.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';

	export let title: string;
	export let clickable: boolean = true;
	export let reloadable: boolean = false;
	export let reloading: boolean = false;
	export let ready: boolean = false;

	const dispatch = createEventDispatcher();
	let pointerPressed = false;

	function hasParentWithClass(element: HTMLElement, classname: string): boolean {
		let currentElement: HTMLElement | null = element;

		while (currentElement) {
			if (currentElement.classList.contains(classname)) {
				return true;
			}
			currentElement = currentElement.parentElement;
		}

		return false;
	}

	function handlePointerStart(e: PointerEvent) {
		let target = e.target as HTMLElement;
		if (
			!(clickable && ready) ||
			(hasParentWithClass(target, 'dont-open-modal') &&
				!hasParentWithClass(target, 'override-open-modal'))
		) {
			return;
		}

		pointerPressed = true;
		window.addEventListener('pointercancel', handlePointerEnd);
		window.addEventListener('pointerup', handlePointerEnd);
	}

	function handlePointerEnd() {
		pointerPressed = false;
		window.removeEventListener('pointercancel', handlePointerEnd);
		window.removeEventListener('pointerup', handlePointerEnd);
	}
</script>

<button
	on:click={() => {
		if (ready) dispatch('click');
	}}
	on:pointerdown={handlePointerStart}
	aria-label={title}
	disabled={!clickable}
	class="{pointerPressed
		? 'scale-[97%]'
		: ''} flex h-full w-full flex-col items-center space-y-1 rounded-2xl bg-[#ddb8c1] p-4 pt-2 pb-3 transition-transform sm:w-96 dark:bg-[#3b1725]"
>
	<div class="flex w-full flex-row items-center justify-between">
		{#if clickable}
			<!-- <Maximize2 size={20} strokeWidth={3} /> -->
			<FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
			<i class="{ready ? '' : 'opacity-40'} fa-solid fa-up-right-and-down-left-from-center w-4"></i>
		{/if}
		<header class="w-full grow text-center text-xl font-bold">{title}</header>
		{#if reloadable}
			<TileInteractiveElementWrapper>
				{#if reloading}
					loading
					<!-- <ProgressRadial
						width="w-4 scale-125"
						stroke={80}
						value={undefined}
						strokeLinecap="round"
						track="stroke-surface-500/30 dark:stroke-surface-300/30"
					/> -->
				{:else}
					<button
						id="calendarReloadButton"
						aria-label="Daten neu laden"
						class="btn-icon fa-solid fa-check size-4 shrink-0 scale-110"
						on:click={() => dispatch('reload')}
						on:mouseenter={() => {
							document.getElementById('calendarReloadButton')?.classList.remove('fa-check');
							document.getElementById('calendarReloadButton')?.classList.add('fa-rotate-right');
						}}
						on:mouseleave={() => {
							document.getElementById('calendarReloadButton')?.classList.add('fa-check');
							document.getElementById('calendarReloadButton')?.classList.remove('fa-rotate-right');
						}}
					></button>
				{/if}
			</TileInteractiveElementWrapper>
		{:else if clickable}
			<div class="w-4"></div>
		{/if}
	</div>
	{#if ready}
		<slot name="header" />
	{/if}

	<div class="flex h-full w-full flex-col items-center justify-center">
		{#if ready}
			<slot />
		{:else}
			lade
			<!-- <ProgressRadial
				width="w-20"
				stroke={80}
				value={undefined}
				strokeLinecap="round"
				track="stroke-surface-500/30 dark:stroke-surface-300/30"
			/> -->
		{/if}
	</div>

	{#if ready}
		<TileInteractiveElementWrapper>
			<slot name="footer" />
		</TileInteractiveElementWrapper>
	{/if}
</button>
