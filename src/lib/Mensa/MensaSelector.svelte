<script lang="ts">
	import { createEventDispatcher, getContext, tick } from 'svelte';
	import type { Writable } from 'svelte/store';
	// import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	import type { Canteen } from '../types';
	import { getAltDayString, getNextWeekday } from '$lib/TSHelpers/DateHelper';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import type { SvelteDate } from 'svelte/reactivity';
	// import OpenMensaModal from '$lib/TilesAndModals/OpenMensaModal.svelte';

	// export let canteenSelectListValue: number | undefined = undefined;
	// export let selectedCanteen: Writable<number>;
	// export let selectedOpenMensaName: Writable<string>;
	// export let canteens: Array<Canteen>;
	// export let selectedDate: Date = getNextWeekday();

	let {
		canteenSelectListValue = $bindable<number | undefined>(undefined),
		selectedCanteen,
		selectedOpenMensaName,
		canteens,
		// selectedDate = $bindable<Date>(getNextWeekday()),
	}: {
		canteenSelectListValue: number | undefined;
		selectedCanteen: Writable<number>;
		selectedOpenMensaName: Writable<string>;
		canteens: Array<Canteen>;
		// selectedDate: Date;
	} = $props();

	let selectedDate: SvelteDate = $state(getNextWeekday() as SvelteDate);

	// key to reload canteens dropdown when an "openmensa" canteen is added to the list
	let unique = {};

	const dispatch = createEventDispatcher();
	// const modalStore = getModalStore();
	const isInsideDashboardModal = getContext('dashboardModal') ?? false;

	// let openmensaModalComponent: ModalComponent;
	// let openMensaModal: ModalSettings;

	// openmensaModalComponent = {
	// 	ref: OpenMensaModal,
	// 	props: {
	// 		onOpenMensaSelection: handleOpenMensaSelection
	// 	}
	// };

	// openMensaModal = {
	// 	type: 'component',
	// 	component: openmensaModalComponent
	// };

	function canteens_populated(_element: HTMLSelectElement) {
		// allegedly, svelte actions trigger once an element is created,
		// but canteenSelectListValueDropdown is still undefined at this point sooo...
		tick().then(() => {
			canteenSelectListValue = $selectedCanteen;
		});
	}

	function changeCanteen(canteenId: number | undefined) {
		if (canteenId === 0) {
			// sweet sentinel value which means "other mensa" was selected
			canteenSelectListValue = $selectedCanteen;
			// modalStore.close();
			// start openmensa selection flow
			// modalStore.trigger(openMensaModal);
		} else {
			selectedCanteen.set(canteenId!);
			dispatch('selectChanged');
		}
	}

	// function handleOpenMensaSelection(canteenId: number, canteenName: string) {
	// 	const idxOldOpenMensa = canteens.findIndex((canteen) => canteen.id < 0);
	// 	if (idxOldOpenMensa != -1) {
	// 		canteens[idxOldOpenMensa] = {
	// 			id: canteenId * -1,
	// 			name: canteenName
	// 		};
	// 	} else {
	// 		canteens.splice(canteens.length - 1, 0, {
	// 			id: canteenId * -1,
	// 			name: canteenName
	// 		});
	// 	}

	// 	unique = {};

	// 	// omfg
	// 	selectedCanteen.set(canteenId * -1);
	// 	selectedOpenMensaName.set(canteenName);
	// 	canteenSelectListValue = canteenId * -1;
	// 	dispatch('selectChanged');
	// }

	function handleDaySelection(forward: boolean) {
		const day = selectedDate.getDay();
		let delta: number;

		if (forward) {
			delta = day === 5 ? 3 : day === 6 ? 2 : 1;
		} else {
			delta = day === 1 ? -3 : day === 0 ? -2 : -1;
		}

		selectedDate.setDate(selectedDate.getDate() + delta);
		dispatch('selectChanged', selectedDate);
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (isInsideDashboardModal) {
			if (e.key == 'ArrowLeft') handleDaySelection(false);
			else if (e.key == 'ArrowRight') handleDaySelection(true);
		}
	}}
/>

<div class="flex w-full flex-row items-center justify-between">
	<p class="font-bold">{getAltDayString(selectedDate)}</p>

	<div class="join grid grid-cols-2 gap-0.5">
		<button
			class="btn join-item w-10 rounded-l-full btn-sm btn-accent"
			onclick={() => {
				handleDaySelection(false);
			}}><FontAwesomeIcon icon={faArrowLeft} /></button
		>
		<button
			class="btn join-item w-10 rounded-r-full btn-sm btn-accent"
			onclick={() => {
				handleDaySelection(true);
			}}><FontAwesomeIcon icon={faArrowRight} /></button
		>
	</div>
</div>

<div class="mb-2 flex w-full items-center space-x-1">
	<button
		aria-label="Vorheriger Tag"
		onclick={() => handleDaySelection(false)}
		class="btn btn-circle size-10 shrink-0 btn-accent"
	>
		<FontAwesomeIcon icon={faArrowLeft} />
	</button>
	{#key unique}
		<select
			aria-label="Mensa auswählen"
			class="select transition-none"
			bind:value={canteenSelectListValue}
			onchange={() => {
				changeCanteen(canteenSelectListValue);
			}}
			use:canteens_populated
		>
			{#each canteens as canteen (canteen.id)}
				<option value={canteen.id}>{canteen.name}</option>
			{/each}
		</select>
	{/key}
	<button
		aria-label="Nächster Tag"
		onclick={() => handleDaySelection(true)}
		class="btn btn-circle size-10 shrink-0 btn-accent"
	>
		<FontAwesomeIcon icon={faArrowRight} />
	</button>
</div>
