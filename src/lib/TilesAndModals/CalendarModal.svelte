<script lang="ts">
	import { type EventUnix } from '$lib/types';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import type { Writable } from 'svelte/store';
	import { type SvelteComponent } from 'svelte';
	import { Calendar, TimeGrid } from '@event-calendar/core';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import { unixEventsToEvents } from '$lib/Calendar/CalendarFuncs';
	import EventInfoModal from '$lib/components/calendar/EventInfoModal.svelte';
	import { SvelteDate } from 'svelte/reactivity';

	let ec: SvelteComponent | undefined = $state();
	let {
		modal = $bindable<HTMLDialogElement | null>(null),
		storedEventsUnix
	}: {
		modal: HTMLDialogElement | null;
		storedEventsUnix: Writable<EventUnix[]> | undefined;
	} = $props();

	let eventInfoModal = $state<HTMLDialogElement | null>(null);
	let selectedEvent = $state<unknown | null>(null);

	type dayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

	const hiddenDays: dayOfWeek[] = [0, 6];

	let options = $derived({
		view: 'timeGridWeek',
		events: unixEventsToEvents($storedEventsUnix ?? []),
		height: '100%',
		allDaySlot: false,
		hiddenDays: hiddenDays,
		headerToolbar: {
			start: '',
			center: '',
			end: ''
		},
		eventClick: (info: { event: unknown }) => {
			selectedEvent = info.event;
			eventInfoModal?.showModal();
		},
		eventContent: (info: {
			event: { title?: unknown; extendedProps?: Record<string, unknown>; start: Date };
			timeText: string;
		}) => {
			const timeStart = info.event.start.toLocaleTimeString('de', { timeStyle: 'short' });
			return `${info.event.title}\n${timeStart}`;
		}
	});

	$effect(() => {
		if (storedEventsUnix && $storedEventsUnix) {
			const events = unixEventsToEvents($storedEventsUnix);
			ec!.setOption('events', events);
		}
	});

	let isCurrentWeek = $state(() => {
		const view = ec?.getView();
		if (!view) return false;

		const start = new SvelteDate(view.currentStart);
		start.setDate(start.getDate() + 1);

		const end = new SvelteDate(view.currentEnd);
		end.setDate(end.getDate() + 1);

		const now = new Date();
		return start <= now && now <= end;
	});
</script>

<EventInfoModal bind:modal={eventInfoModal} event={selectedEvent} />

<DashboardModal bind:modal title="Kalender">
	<div class="flex w-full flex-row items-center">
		{#if ec}
			<p class="font-bold">{ec.getView().title}</p>
		{/if}
		<span class="grow"></span>

		<button
			disabled={isCurrentWeek()}
			onclick={() => {
				let today = new SvelteDate();
				// sonntag in deutschland ^= teil der vorh. Woche, in USA schon nächste woche, daher -1
				today.setDate(today.getDate() - 1);

				if (ec) ec.setOption('date', today);
			}}
			class="btn mr-1 rounded-full btn-sm btn-accent">Heute</button
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

	<div class="min-h-0 grow">
		<Calendar bind:this={ec} plugins={[TimeGrid]} {options} />
	</div>
</DashboardModal>
