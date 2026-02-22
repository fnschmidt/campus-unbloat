<script lang="ts">
	import type { Writable } from 'svelte/store';

	import type { MealGroup } from '../types';
	import MealViewAccordion from './MealViewAccordion.svelte';
	import MediaQuery from 'svelte-media-queries';
	import { createEventDispatcher, getContext, mount } from 'svelte';
	import MealGroupContainer from './MealGroupContainer.svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';

	const isInsideDashboardModal: boolean = getContext('dashboardModal') ?? false;
	export let expandedMealCategories: Writable<Array<string>>;
	export let mealGroups: Array<MealGroup>;

	const dispatch = createEventDispatcher();

	let column1: MealGroup[];
	let column2: MealGroup[];
	$: splitGroups(mealGroups);

	async function splitGroups(mealGroups: MealGroup[]) {
		if (!isInsideDashboardModal) return;

		let heights: number[] = getMealgroupHeights(mealGroups);
		[column1, column2] = balanceElementsDP(mealGroups, heights);
	}

	// chatgpt turned up the heat with this one
	function balanceElementsDP(
		mealGroups: MealGroup[],
		heights: number[]
	): [MealGroup[], MealGroup[]] {
		const totalSum = heights.reduce((acc, h) => acc + h, 0);
		const target = Math.floor(totalSum / 2);

		// DP table to track which sums are possible
		const dp = new Array(target + 1).fill(false);
		dp[0] = true;

		// Track which elements contribute to a sum
		const backtrack: Map<number, Set<number>> = new SvelteMap();
		for (let s = 0; s <= target; s++) {
			backtrack.set(s, new Set());
		}

		for (let i = 0; i < heights.length; i++) {
			for (let s = target; s >= heights[i]; s--) {
				if (dp[s - heights[i]]) {
					dp[s] = true;
					backtrack.get(s)?.add(i);
				}
			}
		}

		// Find the closest sum to target
		let bestSum = target;
		while (!dp[bestSum]) bestSum--;

		// Retrieve indices of elements forming bestSum
		const used = new SvelteSet<number>();
		let sum = bestSum;

		while (sum > 0) {
			let chosenIndex = -1;

			// Select the smallest index that hasn't been used yet
			for (let index of backtrack.get(sum) ?? []) {
				if (!used.has(index)) {
					chosenIndex = index;
					break;
				}
			}

			if (chosenIndex === -1) break; // Failsafe exit

			used.add(chosenIndex);
			sum -= heights[chosenIndex];
		}

		// Split elements into two groups
		let col1: MealGroup[] = [],
			col2: MealGroup[] = [];
		for (let i = 0; i < mealGroups.length; i++) {
			if (used.has(i)) col1.push(mealGroups[i]);
			else col2.push(mealGroups[i]);
		}

		return [col1, col2];
	}

	const container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.visibility = 'hidden';
	container.style.width = '266px';
	document.body.appendChild(container);

	function getMealgroupHeights(mealGroups: MealGroup[]): number[] {
		let heights: number[] = [];

		for (const mealGroup of mealGroups) {
			mount(MealGroupContainer, {
				props: { mealGroup },
				target: container
			});

			const height = container.clientHeight + 16 + 42; // +(2*8 padding) + (24 accordion title + 2*8padding) + 2px between items
			heights.push(height);
			container.innerHTML = '';
		}

		return heights;
	}
</script>

<!-- hacky -->
<MediaQuery query="(min-width: 640px)" let:matches>
	{#if mealGroups.length === 0}
		<p class="pt-2 text-center">Keine Gerichte verfügbar.</p>
	{:else if isInsideDashboardModal && matches && mealGroups.length > 1}
		<div class="grid grid-cols-2 gap-3">
			<MealViewAccordion alwaysExpanded={true} mealGroups={column1} {expandedMealCategories} />
			<MealViewAccordion alwaysExpanded={true} mealGroups={column2} {expandedMealCategories} />
		</div>
	{:else}
		<MealViewAccordion
			alwaysExpanded={isInsideDashboardModal}
			{mealGroups}
			{expandedMealCategories}
			on:mealGroupClicked={() => dispatch('mealGroupClicked')}
		/>
	{/if}
</MediaQuery>
