<script lang="ts">
	import type { MealGroup } from '$lib/types';
	import {
		faBowlFood,
		faBurger,
		faCarrot,
		faCoins,
		faDrumstickBite,
		faEgg,
		faFish,
		faKitchenSet,
		faLeaf,
		faPlus,
		faUtensils,
		faWheelchairMove,
		type IconDefinition
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { createEventDispatcher } from 'svelte';

	export let mealGroup: MealGroup;
	// export let gradientColour: string | undefined;

	const dispatch = createEventDispatcher();

	function getGroupIcon(meal_type: string): [IconDefinition, string, boolean] {
		const defaultCol = '#eeeeee';

		const icons: { [key: string]: [IconDefinition, string, boolean] } = {
			vegan: [faLeaf, '#94c9a9', false],
			vegetarisch: [faEgg, '#c6ecae', false],
			fleisch: [faDrumstickBite, '#885053', true],
			wok: [faKitchenSet, 'f4f07f', false],
			grill: [faBurger, '#fe5f55', true],
			fisch: [faFish, '#777da7', true],
			pastateller: [faBowlFood, defaultCol, false],
			gemüse: [faCarrot, '#c6ecae', false],
			sättigung: [faPlus, defaultCol, false],
			'schneller teller': [faWheelchairMove, defaultCol, false]
		};

		const lowercasedMealType = meal_type.toLowerCase();

		for (const key in icons) {
			if (lowercasedMealType.includes(key)) {
				return icons[key];
			}
		}

		return [faUtensils, defaultCol, false];
	}
</script>

<div
	on:click={() => {
		dispatch('click');
	}}
	role="presentation"
	class="override-open-modal space-y-2"
>
	{#each mealGroup.sub_meals as submeal (submeal)}
		{@const [icon, color, textWhite] = getGroupIcon(mealGroup.meal_type)}
		<div class="card w-full bg-base-100 shadow-md">
			<div class="card-body p-4 pb-2">
				<span>
					<span class="badge h-5 badge-xs badge-primary">{mealGroup.meal_type}</span>
					<span
						class="badge h-5 border-0 badge-xs {textWhite ? 'text-white' : 'text-black'}"
						style={`background-color: ${color};`}><FontAwesomeIcon {icon} /></span
					>
				</span>

				<!-- <div class="flex justify-between"> -->
				<h2 class="text-md w-full text-left font-bold">{submeal.name}</h2>
				<!-- <span class="text-xl">{submeal.price}</span>
				</div> -->
				<!-- <ul class="mt-4 flex flex-col gap-2 text-xs"> -->
				<div class="my-2 space-y-2 text-xs">
					{#if submeal.additional_ingredients.length > 0}
						{@const ingrText = submeal.additional_ingredients.join(' · ')}
						<p>{ingrText}</p>
					{/if}

					{#if submeal.price}
						<span>
							<FontAwesomeIcon icon={faCoins} class="mr-1 inline-block" />
							{submeal.price}
						</span>
					{/if}

					{#if submeal.variations}
						<div class="collapse-arrow collapse">
							<input type="checkbox" />
							<div class="collapse-title pb-2 pl-0 font-semibold">Variationen anzeigen</div>
							<div class="collapse-content space-y-2 pb-0">
								{#each submeal.variations as variation (variation)}
									<div class="border-l-2 border-primary pl-3">
										<p class="font-semibold text-primary">{variation.name}</p>

										<p>
											<span class="font-semibold">Allergene & Zusatzstoffe:</span>
											<span> {variation.allergens_and_add}</span>
										</p>
									</div>
								{/each}
							</div>
						</div>
					{/if}
					{#if submeal.allergens}
						<div class="collapse-arrow collapse">
							<input type="checkbox" />
							<div class="collapse-title pb-2 pl-0 font-semibold">Allergene & Zusatzstoffe</div>
							<div class="collapse-content space-y-2 pb-0">
								{submeal.allergens}
								<!-- <div class="border-l-2 border-primary pl-3"> -->
								<!-- <p class="font-semibold text-primary">{variation.name}</p> -->

								<!-- <p>
										<span class="font-semibold">Allergene & Zusatzstoffe:</span>
										<span> {variation.allergens_and_add}</span>
									</p> -->
								<!-- </div> -->
							</div>
						</div>
					{/if}

					<!-- {#if submeal.variations}
						{#each submeal.variations as variation (variation)}
							<div class="border-l-2 border-accent pl-3">
								<p class="font-semibold">{variation.name}</p>

								<p>
									<span class="font-semibold">Allergene & Zusatzstoffe:</span>
									<span> {variation.allergens_and_add}</span>
								</p>
							</div>
						{/each}
					{/if} -->
				</div>

				<!-- {#each submeal.additional_ingredients as ingredient}
					<p>{ingredient}</p>
					{/each} -->
				<!-- <li> -->
				<!-- <svg
							xmlns="http://www.w3.org/2000/svg"
							class="me-2 inline-block size-4 text-success"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/></svg
						>
						<span>High-resolution image generation</span> -->
				<!-- </li> -->
				<!-- </ul> -->
				<!-- <div class="mt-6">
					<button class="btn btn-block btn-primary">Subscribe</button>
				</div> -->
			</div>
		</div>
		<!-- <div
			class="card-transparent-60 bg-gradient-165 to-40% {gradientColour} space-y-2 px-4 py-2 text-center"
		>
			<strong>{submeal.name}</strong>
			<hr />

			{#if submeal.additional_ingredients.length > 0}
				<div class="flex flex-row space-x-2">
					<div>
						<span class="badge-icon variant-outline p-3">
							<i class="fa-solid fa-plus"></i>
						</span>
					</div>
					<div>
						{#each submeal.additional_ingredients as ingredient (ingredient)}
							<p class="text-left">{ingredient}</p>
						{/each}
					</div>
				</div>
				<hr />
			{/if}

			{#if submeal.allergens}
				<div class="flex flex-row space-x-2">
					<div>
						<span class="badge-icon variant-outline p-3">
							<i class="fa-solid fa-info"></i>
						</span>
					</div>

					<div class="grow text-left">
						<strong>Allergene: </strong><span>{submeal.allergens}</span>
					</div>
				</div>
				<hr />
			{/if}
			<div>
				<i class="w-full text-center">{submeal.price}</i>
			</div>
		</div>

		{#if submeal.variations}
			<div class="card-transparent-60 space-y-2 px-4 py-2">
				<div class="flex space-x-2">
					<div class="badge-icon variant-outline p-3">
						<i class="fa-solid fa-flask-vial"></i>
					</div>
					<strong>Variationen</strong>
				</div>
				{#each submeal.variations as variation (variation)}
					<hr class="pb-1" />
					<strong>{variation.name}</strong>
					{#if variation.allergens_and_add}
						<div class="flex flex-row space-x-2">
							<div>
								<span class="badge-icon variant-outline p-3">
									<i class="fa-solid fa-info"></i>
								</span>
							</div>

							<div class="grow text-left">
								<strong>Allergene: </strong><span>{variation.allergens_and_add}</span>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if} -->
	{/each}
</div>
