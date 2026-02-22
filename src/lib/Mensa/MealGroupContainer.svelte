<script lang="ts">
	import type { MealGroup } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let mealGroup: MealGroup;
	// export let gradientColour: string | undefined;

	const dispatch = createEventDispatcher();
</script>

<div
	on:click={() => {
		dispatch('click');
	}}
	role="presentation"
	class="override-open-modal space-y-1"
>
	{#each mealGroup.sub_meals as submeal (submeal)}
		<div class="card w-full bg-base-100 shadow-sm">
			<div class="card-body">
				<span class="badge badge-xs badge-warning">Vegetarisch</span>
				<!-- <div class="flex justify-between"> -->
				<h2 class="w-full text-left text-lg font-bold">{submeal.name}</h2>
				<!-- <span class="text-xl">{submeal.price}</span>
				</div> -->
				<ul class="mt-6 flex flex-col gap-2 text-xs">
					<li>
						<svg
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
						<span>High-resolution image generation</span>
					</li>
					<li>
						<svg
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
						<span>Customizable style templates</span>
					</li>
					<li>
						<svg
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
						<span>Batch processing capabilities</span>
					</li>
					<li>
						<svg
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
						<span>AI-driven image enhancements</span>
					</li>
					<li class="opacity-50">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="me-2 inline-block size-4 text-base-content/50"
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
						<span class="line-through">Seamless cloud integration</span>
					</li>
					<li class="opacity-50">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="me-2 inline-block size-4 text-base-content/50"
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
						<span class="line-through">Real-time collaboration tools</span>
					</li>
				</ul>
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
