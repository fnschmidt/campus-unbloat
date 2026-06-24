<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';

	import type { Canteen, MensaSelectorEvent } from '../types';
	import { getAltDayString, getNextWeekday, isSameDate } from '$lib/TSHelpers/DateHelper';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faArrowLeft, faArrowRight, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { SvelteDate } from 'svelte/reactivity';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import type { Writable } from 'svelte/store';

	let canteens: Array<Canteen> = $state([]);
	let canteenSelectListValue: number | undefined = $state();
	let selectedCanteen: Writable<number> | undefined = $state();
	let selectedOpenMensaName: Writable<string> | undefined = $state();

	let openMensaModal: HTMLDialogElement | null = $state(null);
	let openMensaCanteens: Array<Canteen> | null = $state(null);
	let openMensaFilteredCanteens: Array<Canteen> | null = $state(null);
	let openMensaFilter: string = $state('');
	let openMensaFilterElement: HTMLInputElement | null = $state(null);
	let openMensaLoading = $state(false);

	$effect(() => {
		if (canteenSelectListValue) {
			notifyParent();
		}
	});

	$effect(() => {
		if (!openMensaCanteens) {
			openMensaFilteredCanteens = null;
			return;
		}

		const filter = openMensaFilter.trim().toLowerCase();
		if (!filter) {
			openMensaFilteredCanteens = openMensaCanteens;
			return;
		}

		const words = filter
			.split(' ')
			.map((w) => w.trim())
			.filter(Boolean);
		openMensaFilteredCanteens = openMensaCanteens.filter((canteen) =>
			words.every((word) => canteen.name.toLowerCase().includes(word))
		);
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
	let unique = $state({});

	const dispatch = createEventDispatcher();

	function changeCanteen(canteenId: number | undefined) {
		if (canteenId === 0) {
			// sweet sentinel value which means "other mensa" was selected
			canteenSelectListValue = $selectedCanteen;
			openOpenMensaModal();
		} else {
			selectedCanteen?.set(canteenId!);
		}
	}

	async function openOpenMensaModal() {
		openMensaModal?.showModal();
		await tick();
		openMensaFilterElement?.focus();

		if (openMensaCanteens || openMensaLoading) return;
		openMensaLoading = true;
		try {
			const res = await fetch('/api/mensa/openmensacanteens');
			if (!res.ok) {
				window.alert('Error fetching OpenMensa canteens');
				openMensaCanteens = [];
				return;
			}
			openMensaCanteens = await res.json();
		} finally {
			openMensaLoading = false;
		}
	}

	function handleOpenMensaSelection(canteenId: number, canteenName: string) {
		const id = canteenId * -1;
		const entry = { id, name: canteenName };

		const idxOldOpenMensa = canteens.findIndex((canteen) => canteen.id < 0);
		if (idxOldOpenMensa !== -1) {
			canteens[idxOldOpenMensa] = entry;
		} else {
			// Insert right before the "Andere Mensa..." sentinel.
			const idxOther = canteens.findIndex((canteen) => canteen.id === 0);
			if (idxOther !== -1) canteens.splice(idxOther, 0, entry);
			else canteens.push(entry);
		}

		unique = {};

		selectedCanteen?.set(id);
		selectedOpenMensaName?.set(canteenName);
		canteenSelectListValue = id;

		openMensaFilter = '';
		openMensaModal?.close();
	}

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

<dialog class="modal select-none" bind:this={openMensaModal}>
	<div class="modal-box max-w-2xl">
		<form method="dialog" class="flex items-center justify-between">
			<h4 class="text-center text-lg font-semibold">OpenMensa</h4>
			<button class="btn btn-circle" aria-label="Schließen">
				<FontAwesomeIcon icon={faXmark} />
			</button>
		</form>

		<div class="mt-3 space-y-3">
			<input
				bind:this={openMensaFilterElement}
				bind:value={openMensaFilter}
				type="text"
				placeholder="Suchen..."
				class="input-bordered input w-full"
			/>

			{#if openMensaLoading}
				<div class="flex justify-center py-8">
					<span class="loading loading-md loading-spinner"></span>
				</div>
			{:else if openMensaFilteredCanteens && openMensaFilteredCanteens.length > 0}
				<div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
					{#each openMensaFilteredCanteens as canteen (canteen.id)}
						<button
							type="button"
							class="flex items-center rounded-2xl bg-primary/20 px-4 py-2"
							onclick={() => handleOpenMensaSelection(canteen.id, canteen.name)}
						>
							<p class="grow text-left">{canteen.name}</p>
							<FontAwesomeIcon icon={faArrowRight} />
						</button>
					{/each}
				</div>
			{:else if openMensaFilteredCanteens}
				<p class="py-4 text-center opacity-70">Keine Ergebnisse.</p>
			{:else}
				<p class="py-4 text-center opacity-70">Liste wird geladen...</p>
			{/if}
		</div>
	</div>
	<form method="dialog" class="modal-backdrop"><button>close</button></form>
</dialog>

<div class="my-2 flex w-full justify-end space-x-1 pr-1">
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
</div>
