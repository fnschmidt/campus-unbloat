<script lang="ts">
	import type { MealGroup } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import MealGroupContainer from './MealGroupContainer.svelte';

	let {
		alwaysExpanded,
		mealGroups,
		expandedMealCategories
	}: {
		alwaysExpanded: boolean;
		mealGroups: MealGroup[];
		expandedMealCategories: Writable<Array<string>>;
	} = $props();
	const dispatch = createEventDispatcher();
</script>

{#each mealGroups as mealGroup (mealGroup)}
	<div class="collapse border border-base-300 bg-base-100">
		<input
			type="checkbox"
			name="my-accordion-1"
			checked={alwaysExpanded || $expandedMealCategories.includes(mealGroup.meal_type)}
			onchange={(e) => {
				expandedMealCategories.update((categories) => {
					if (e.currentTarget.checked) {
						return [...categories, mealGroup.meal_type];
					} else {
						return categories.filter((cat) => cat !== mealGroup.meal_type);
					}
				});
			}}
		/>
		<div class="collapse-title font-semibold">{mealGroup.meal_type}</div>
		<div class="collapse-content text-sm">
			<MealGroupContainer on:click={() => dispatch('mealGroupClicked')} {mealGroup} />
		</div>
	</div>
{/each}
<!-- </div> -->
<!-- <div class="collapse bg-base-100 border border-base-300">
  <input type="radio" name="my-accordion-1" />
  <div class="collapse-title font-semibold">I forgot my password. What should I do?</div>
  <div class="collapse-content text-sm">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</div>
</div>
<div class="collapse bg-base-100 border border-base-300">
  <input type="radio" name="my-accordion-1" />
  <div class="collapse-title font-semibold">How do I update my profile information?</div>
  <div class="collapse-content text-sm">Go to "My Account" settings and select "Edit Profile" to make changes.</div>
</div> -->
