<script lang="ts">
	// import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { onMount, createEventDispatcher } from 'svelte';

	import { ToastPayloadClass, type Timeline, type ToastPayload } from '$lib/types';
	import DashboardTile from '$lib/DashboardTile.svelte';

	const dispatch = createEventDispatcher();
	const sections: { key: keyof Timeline; title: string }[] = [
		{ key: 'fachsemester', title: 'Fachsemester' },
		{ key: 'theoriesemester', title: 'Theoriesemester' },
		{ key: 'praxissemester', title: 'Praxissemester' },
		{ key: 'specials', title: 'Spezielles' }
	];

	let timeline: Timeline;

	onMount(async () => {
		const res = await fetch('/api/timeline');

		if (!res.ok) {
			let error = await res.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};
			dispatch('showToast', payload);
			return;
		} else {
			timeline = await res.json();
		}
	});
</script>

<DashboardTile title="Blockplan" clickable={false} ready={Boolean(timeline)}>
	{#if !(timeline.fachsemester.length > 0 || timeline.theoriesemester.length > 0 || timeline.praxissemester.length > 0 || timeline.specials.length > 0)}
		Es gibt keine Einträge.
	{/if}
	{#each sections as section (section.key)}
		<div class="collapse-arrow collapse border border-base-300 bg-base-100">
			<input type="checkbox" />
			<div class="collapse-title font-semibold">{section.title}</div>
			<div class="collapse-content text-sm">
				<ul class="ml-4 list-disc text-left">
					{#each timeline[section.key] as event (event.description)}
						<li class="text-xs select-all">{event.description}</li>
					{/each}
				</ul>
			</div>
		</div>
	{/each}
	<!-- <Accordion>
		{#each sections as section (section.key)}
			{#if timeline[section.key].length > 0}
				<AccordionItem>
					<svelte:fragment slot="summary">{section.title}</svelte:fragment>
					<svelte:fragment slot="content">
						<ul class="list-disc text-left ml-4">
							{#each timeline[section.key] as event}
								<li class="text-xs select-all">{event.description}</li>
							{/each}
						</ul>
					</svelte:fragment>
				</AccordionItem>
			{/if}
		{/each}
	</Accordion> -->
</DashboardTile>
