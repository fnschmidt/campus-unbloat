<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { fetchMeals, fetchOpenMeals } from '$lib/Mensa/MensaFuncs';
	import { getNextWeekday } from '$lib/TSHelpers/DateHelper';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import type { Canteen, MealGroup } from '$lib/types';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import MensaModal from './MensaModal.svelte';
	import TileInteractiveElementWrapper from './TileInteractiveElementWrapper.svelte';
	import MensaSelector from '$lib/Mensa/MensaSelector.svelte';
	import MealView from '$lib/Mensa/MealView.svelte';

	let modal: HTMLDialogElement | null = $state(null);
	let canteens: Array<Canteen> = $state([]);
	let canteenSelectListValue: number | undefined = $state();
	let mealGroups: Array<MealGroup> | undefined = $state();

	let showMealsInTile: Writable<boolean> | undefined = $state();
	let expandedMealCategories: Writable<Array<string>> | undefined = $state();
	let selectedCanteen: Writable<number> | undefined = $state();
	let selectedOpenMensaName: Writable<string> | undefined = $state();

	let selectedDate: Date = $state(getNextWeekday());
	let unique = $state({});

	onMount(async () => {
		const res = await fetch('/api/mensa/canteens');

		if (!res.ok) {
			window.alert('Error fetching canteens');
		}

		// if (!res.ok) {
		// 	let error = await res.text();
		// 	let payload: ToastPayload = {
		// 		text: error,
		// 		class: ToastPayloadClass.error
		// 	};

		// 	dispatch('showToast', payload);
		// 	return;
		// }

		canteens = await res.json();

		showMealsInTile = persistentStore('showMealsInTile', true);
		expandedMealCategories = persistentStore('expandedMealCategories', []);
		selectedCanteen = persistentStore('selectedCanteen', canteens[0].id);
		selectedOpenMensaName = persistentStore('selectedOpenMensaName', '');

		if ($selectedCanteen && $selectedCanteen < 0) {
			canteens.push({ id: $selectedCanteen, name: $selectedOpenMensaName! });
		}
		canteens.push({
			id: 0,
			name: 'Andere Mensa...'
		});

		handleMealsFetch();
	});

	async function handleMealsFetch(): Promise<MealGroup[] | undefined> {
		if (!$selectedCanteen) return;

		try {
			if ($selectedCanteen > 0) {
				mealGroups = await fetchMeals(selectedDate, $selectedCanteen);
				// modalComponent.props!.mealGroups = mealGroups;
				return mealGroups;
			} else {
				mealGroups = await fetchOpenMeals(selectedDate, $selectedCanteen * -1);
				// modalComponent.props!.mealGroups = mealGroups;
				return mealGroups;
			}
		} catch (e) {
			window.alert(e);
		}
		// } catch (e) {
		// 	if (e instanceof Error) {
		// 		let payload: ToastPayload = {
		// 			text: e.message,
		// 			class: ToastPayloadClass.error
		// 		};

		// 		dispatch('showToast', payload);
		// 	}
		// }
	}

	function handleSelectChange(e: CustomEvent<Date>) {
		if (e.detail) {
			selectedDate = e.detail;
			// modalComponent.props!.selectedDate = selectedDate;
		}

		handleMealsFetch();
	}

	async function handleModalSelectChange(date: Date): Promise<MealGroup[]> {
		selectedDate = date;
		await handleMealsFetch();
		// dont care
		if ($selectedCanteen && $selectedCanteen < 0) {
			unique = {};
		}
		return mealGroups!;
	}
</script>

{#if selectedCanteen && selectedOpenMensaName}
	<MensaModal
		bind:modal
		{mealGroups}
		{canteens}
		{expandedMealCategories}
		{selectedCanteen}
		{selectedOpenMensaName}
		{selectedDate}
		onSelectedChange={handleModalSelectChange}
	></MensaModal>
{/if}

<DashboardTile title="Mensa" on:click={() => modal?.showModal()} ready={Boolean(canteens)}>
	{#if $showMealsInTile && canteens && selectedCanteen && selectedOpenMensaName}
		<TileInteractiveElementWrapper add_class="w-full">
			{#key unique}
				<MensaSelector
					on:selectChanged={handleSelectChange}
					bind:canteenSelectListValue
					{selectedCanteen}
					{selectedOpenMensaName}
					{canteens}
				/>
			{/key}
		</TileInteractiveElementWrapper>
	{/if}

	<TileInteractiveElementWrapper add_class="w-full">
		{#if $showMealsInTile && mealGroups && expandedMealCategories}
			<MealView
				bind:expandedMealCategories
				{mealGroups}
				on:mealGroupClicked={() => modal?.show()}
			/>
		{/if}
	</TileInteractiveElementWrapper>

	<!-- {#each mealGroups as mg (mg)}
		bruh
	{/each} -->
</DashboardTile>
