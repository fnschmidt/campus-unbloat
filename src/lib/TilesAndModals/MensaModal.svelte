<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import MealView from '$lib/Mensa/MealView.svelte';
	import MensaSelector from '$lib/Mensa/MensaSelector.svelte';
	import type { Canteen, MealGroup } from '$lib/types';
	import type { Writable } from 'svelte/store';

	// export let onSelectedChange: (date: Date) => Promise<MealGroup[]>;
	// export let parent: SvelteComponent;
	// export let canteens: Array<Canteen>;
	// export let selectedCanteen: Writable<number>;
	// export let selectedOpenMensaName: Writable<string>;
	// export let expandedMealCategories: Writable<Array<string>>;
	// export let mealGroups: Array<MealGroup> | undefined = undefined;
	// export let selectedDate: Date;

	let {
		modal = $bindable<HTMLDialogElement | null>(null),
		mealGroups,
		expandedMealCategories,
		onSelectedChange,
		selectedCanteen,
		selectedOpenMensaName,
		canteens,
		selectedDate
	}: {
		modal: HTMLDialogElement | null;
		mealGroups: MealGroup[] | undefined;
		expandedMealCategories: Writable<Array<string>> | undefined;
		onSelectedChange: (date: Date) => Promise<MealGroup[]>;
		selectedCanteen: Writable<number>;
		selectedOpenMensaName: Writable<string>;
		canteens: Array<Canteen>;
		selectedDate: Date;
	} = $props();

	async function handleSelectChange(e: CustomEvent<Date>) {
		if (e.detail) selectedDate = e.detail;
		mealGroups = await onSelectedChange(selectedDate);
	}
</script>

<DashboardModal bind:modal title="Mensa">
	<MensaSelector
		on:selectChanged={handleSelectChange}
		{selectedCanteen}
		{selectedOpenMensaName}
		{canteens}
		{selectedDate}
	/>
	{#if mealGroups && expandedMealCategories}
		<MealView {expandedMealCategories} {mealGroups} />
	{/if}
</DashboardModal>
