<script lang="ts">
	import { padIt } from '$lib/TSHelpers/DateHelper';
	import { getAltNoEventString } from './CalendarFuncs';
	import type { Event } from '$lib/types';

	export let currentEvents: Array<Event>;
	export let selectedDate: Date;
</script>

<div class="space-y-1 w-full flex-col justify-center">
	{#if currentEvents.length == 0}
		<p class="font-semibold text-center">{getAltNoEventString(selectedDate)}</p>
	{:else}
		{#each currentEvents as { start, end, title, room, instructor, remarks, color }}
			<div class="flex flex-row card-transparent-60">
				<div class="w-3 rounded-l-3xl" style="background-color: {color};" />
				<div class="mr-2 py-2 w-full flex flex-col justify-center items-center">
					<div>
						<strong>{title}</strong>
						<strong class="mx-1">•</strong>
						{padIt(start.getHours().toString())}:{padIt(start.getMinutes().toString())}
						-
						{padIt(end.getHours().toString())}:{padIt(end.getMinutes().toString())}
					</div>

					<p>
						{#if instructor && room}
							{instructor}, Raum {room}
						{:else if instructor}
							{instructor}
						{:else if room}
							Raum: {room}
						{/if}
					</p>

					{#if remarks}
						<div class="mt-0.5 px-2 flex flex-row space-x-2 items-center pr-8">
							<i class="fa-solid fa-info-circle"></i>
							<p class="text-center">{remarks}</p>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>
