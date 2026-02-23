<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import type { Canteen, MensaSelectorEvent } from '../types';
	import { getAltDayString, getNextWeekday, isSameDate } from '$lib/TSHelpers/DateHelper';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import { SvelteDate } from 'svelte/reactivity';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import type { Writable } from 'svelte/store';

	let canteens: Array<Canteen> = $state([]);
	let canteenSelectListValue: number | undefined = $state();
	let selectedCanteen: Writable<number> | undefined = $state();
	let selectedOpenMensaName: Writable<string> | undefined = $state();

	$effect(() => {
		if (canteenSelectListValue) {
			notifyParent();
		}
	});

	async function notifyParent() {
		const payload: MensaSelectorEvent = {
			date: selectedDate,
			canteenId: $selectedCanteen!
		};
		dispatch('selectChanged', payload);
	}

	onMount(async () => {
		const res = await fetch('/api/mensa/canteens');

		if (!res.ok) {
			window.alert('Error fetching canteens');
			return;
		}

		canteens = await res.json();
		selectedCanteen = persistentStore('selectedCanteen', canteens[0].id);
		selectedOpenMensaName = persistentStore('selectedOpenMensaName', '');

		if ($selectedCanteen && $selectedCanteen < 0) {
			canteens.push({ id: $selectedCanteen, name: $selectedOpenMensaName! });
		}
		canteens.push({
			id: 0,
			name: 'Andere Mensa...'
		});

		canteenSelectListValue = $selectedCanteen;
	});

	let selectedDate: SvelteDate = $state(getNextWeekday() as SvelteDate);

	// key to reload canteens dropdown when an "openmensa" canteen is added to the list
	let unique = {};

	const dispatch = createEventDispatcher();
	// const modalStore = getModalStore();
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

	function changeCanteen(canteenId: number | undefined) {
		if (canteenId === 0) {
			// sweet sentinel value which means "other mensa" was selected
			canteenSelectListValue = $selectedCanteen;
			openOpenMensaModal();
		} else {
			selectedCanteen?.set(canteenId!);
		}
	}

	function openOpenMensaModal() {
		throw new Error('todo');
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

		const nextDate = new SvelteDate(selectedDate);
		nextDate.setDate(nextDate.getDate() + delta);
		selectedDate = nextDate;
		// notifyParent();
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key == 'ArrowLeft') handleDaySelection(false);
		else if (e.key == 'ArrowRight') handleDaySelection(true);
	}}
/>

<div class="flex w-full flex-row items-center justify-between">
	<p class="font-bold">{getAltDayString(selectedDate)}</p>

	<div class="flex flex-row space-x-0.5">
		<button
			disabled={isSameDate(selectedDate, getNextWeekday())}
			onclick={() => {
				// let today = new SvelteDate();
				// sonntag in deutschland ^= teil der vorh. Woche, in USA schon nächste woche, daher -1
				selectedDate = getNextWeekday() as SvelteDate;
			}}
			class="btn mr-1 rounded-full btn-sm btn-accent">Heute</button
		>

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

<div class="my-2 flex w-full justify-end space-x-1 pr-1">
	<!-- <button
		aria-label="Vorheriger Tag"
		onclick={() => handleDaySelection(false)}
		class="btn btn-circle size-10 shrink-0 btn-accent"
	>
		<FontAwesomeIcon icon={faArrowLeft} />
	</button> -->
	{#key unique}
		<select
			aria-label="Mensa auswählen"
			class="select w-full transition-none"
			bind:value={canteenSelectListValue}
			onchange={() => {
				changeCanteen(canteenSelectListValue);
			}}
		>
			{#each canteens as canteen (canteen.id)}
				<option value={canteen.id}>{canteen.name}</option>
			{/each}
		</select>
	{/key}
	<!-- <button
		aria-label="Nächster Tag"
		onclick={() => handleDaySelection(true)}
		class="btn btn-circle size-10 shrink-0 btn-accent"
	>
		<FontAwesomeIcon icon={faArrowRight} />
	</button> -->
</div>
