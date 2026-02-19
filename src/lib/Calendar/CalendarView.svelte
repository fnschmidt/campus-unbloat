<script lang="ts">
	import { padIt } from '$lib/TSHelpers/DateHelper';
	import { getAltNoEventString } from './CalendarFuncs';
	import type { Event } from '$lib/types';

	export let currentEvents: Array<Event>;
	export let selectedDate: Date;
</script>

<div class="w-full flex-col justify-center space-y-1">
	{#if currentEvents.length == 0}
		<p class="text-center font-semibold">{getAltNoEventString(selectedDate)}</p>
	{:else}
		{#each currentEvents as { start, end, title, room, instructor, remarks, color }}
			<div class="card-transparent-60 flex flex-row">
				<div class="w-3 rounded-l-3xl" style="background-color: {color};" />
				<div class="mr-2 flex w-full flex-col items-center justify-center py-2">
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
						<div class="mt-0.5 flex flex-row items-center space-x-2 px-2 pr-8">
							<i class="fa-solid fa-info-circle"></i>
							<p class="text-center">{remarks}</p>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	{/if}
</div>
