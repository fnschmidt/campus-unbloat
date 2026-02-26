<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import TileInteractiveElementWrapper from './TilesAndModals/TileInteractiveElementWrapper.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faCheck,
		faRotateRight,
		faUpRightAndDownLeftFromCenter
	} from '@fortawesome/free-solid-svg-icons';

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
		: ''} flex h-full w-full flex-col items-center space-y-1 rounded-2xl bg-base-100 p-4 pt-2 pb-3 shadow-2xl/10 transition-transform sm:w-96"
>
	<div class="flex w-full flex-row items-center justify-between">
		{#if clickable}
			<FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
		{/if}
		<header class="w-full grow text-center text-xl font-bold">{title}</header>
		{#if reloadable}
			<TileInteractiveElementWrapper>
				{#if reloading}
					<span class="loading -mt-0.5 -mr-0.5 mb-0.5 ml-0.5 loading-sm loading-dots"></span>
				{:else}
					<button
						on:click={() => dispatch('reload')}
						class="group hover:cursor-pointer"
						aria-label="Daten neu laden"
					>
						<span class="block group-hover:hidden">
							<FontAwesomeIcon icon={faCheck} class="block group-hover:hidden" />
						</span>
						<span class="hidden group-hover:block">
							<FontAwesomeIcon icon={faRotateRight} class="hidden group-hover:block" />
						</span>
					</button>
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
			<span class="loading h-42 loading-xl loading-dots"></span>
		{/if}
	</div>

	{#if ready}
		<TileInteractiveElementWrapper>
			<slot name="footer" />
		</TileInteractiveElementWrapper>
	{/if}
</button>
