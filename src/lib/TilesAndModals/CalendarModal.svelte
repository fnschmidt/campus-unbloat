<script lang="ts">
	import { type EventUnix } from '$lib/types';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import type { Writable } from 'svelte/store';
	import { type SvelteComponent } from 'svelte';
	import { Calendar, TimeGrid } from '@event-calendar/core';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import { unixEventsToEvents } from '$lib/Calendar/CalendarFuncs';

	let ec: SvelteComponent | undefined = $state();
	let {
		modal = $bindable<HTMLDialogElement | null>(null),
		storedEventsUnix
	}: {
		modal: HTMLDialogElement | null;
		storedEventsUnix: Writable<EventUnix[]> | undefined;
	} = $props();

	type Content = string | { html: string } | { domNodes: Node[] };

	interface ModuleEvent {
		title: Content;
		extendedProps: Record<string, unknown>;
	}

	type dayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
	interface contentInfo {
		event: ModuleEvent;
		timeText: string;
	}

	const hiddenDays: dayOfWeek[] = [0, 6];

	let options = $derived({
		view: 'timeGridWeek',
		events: unixEventsToEvents($storedEventsUnix ?? []),
		height: '100%',
		allDaySlot: false,
		hiddenDays: hiddenDays,
		// headerToolbar: {
		// 	start: '',
		// 	center: '',
		// 	end: ''
		// },
		eventClick: (info: unknown) => {
			console.log(info);
		},
		eventContent: (info: contentInfo) => {
			return `${info.timeText}\n${info.event.title}${info.event.extendedProps.room ? `, Raum ${info.event.extendedProps.room}` : ''}`;
		}
	});

	$effect(() => {
		if (storedEventsUnix && $storedEventsUnix) {
			const events = unixEventsToEvents($storedEventsUnix);
			ec!.setOption('events', events);
		}
	});
</script>

<DashboardModal bind:modal title="Kalender">
	<div class="flex w-full flex-row items-center">
		{#if ec}
			<p class="font-bold">{ec.getView().title}</p>
		{/if}
		<span class="grow"></span>

		<button
			onclick={() => {
				if (ec) console.log(ec);
			}}
			class="btn rounded-full btn-sm btn-accent">Heute</button
		>

		<div class="join grid grid-cols-2 gap-0.5">
			<button
				class="btn join-item w-10 rounded-l-full btn-sm btn-accent"
				onclick={() => {
					if (ec) ec.prev();
				}}><FontAwesomeIcon icon={faArrowLeft} /></button
			>
			<button
				class="btn join-item w-10 rounded-r-full btn-sm btn-accent"
				onclick={() => {
					if (ec) ec.next();
				}}><FontAwesomeIcon icon={faArrowRight} /></button
			>
		</div>
	</div>

	<Calendar bind:this={ec} plugins={[TimeGrid]} {options} />
</DashboardModal>
