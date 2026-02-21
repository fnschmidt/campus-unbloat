<script lang="ts">
	// import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount, type SvelteComponent } from 'svelte';
	import { type Writable } from 'svelte/store';

	import DashboardTile from '$lib/DashboardTile.svelte';
	import CalendarModal from './CalendarModal.svelte';
	// import CalendarSelector from '$lib/Calendar/CalendarSelector.svelte';
	// import CalendarView from '$lib/Calendar/CalendarView.svelte';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import { getAltDayString } from '$lib/TSHelpers/DateHelper';
	import { unixEventsToEvents } from '$lib/Calendar/CalendarFuncs';
	import type { EventUnix, Event } from '$lib/types';
	import { Calendar, List } from '@event-calendar/core';
	import TileInteractiveElementWrapper from './TileInteractiveElementWrapper.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

	let isReloading: boolean = $state(false);

	let modal: HTMLDialogElement | null = $state(null);

	let events: Array<Event> = [];
	let storedEventsUnix: Writable<EventUnix[]> | undefined = $state();
	let lastEventUpdate: Writable<Date | null>;
	let loading: boolean = $state(true);

	let calendarElement: SvelteComponent | undefined = $state();

	type fetchedCalendar = Array<{
		title: string;
		start: number; // UNIX Timestamp
		end: number; // UNIX Timestamp
		allDay: boolean;
		description: string;
		color: string;
		font_color: string;
		editable: boolean;
		room: string;
		sroom: string;
		instructor: string;
		sinstructor: string;
		remarks: string;
	}>;

	interface contentInfo {
		event: ModuleEvent;
		timeText: string;
	}

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
		view: 'listDay',
		events: events,
		height: '100%',
		width: '100%',
		hiddenDays: hiddenDays,
		headerToolbar: {
			start: '',
			center: '',
			end: ''
		},
		listDayFormat: () => '',
		listDaySideFormat: () => '',
		noEventsContent: 'Es findet keine Vorlesung statt! 🚀',
		eventContent: (info: contentInfo) => {
			return `${info.timeText}\n${info.event.title}${info.event.extendedProps.room ? `, Raum ${info.event.extendedProps.room}` : ''}`;
		}
	});

	onMount(async () => {
		storedEventsUnix = persistentStore('storedEvents', []);
		lastEventUpdate = persistentStore('lastEventUpdate', null);

		events = unixEventsToEvents($storedEventsUnix!);

		if (olderThanOneHour($lastEventUpdate)) {
			fetchCalendar();
		}
	});

	function fetchedToUnixEvents(fetched: fetchedCalendar): EventUnix[] {
		let newEventsUnix: EventUnix[] = [];

		fetched.forEach((element) => {
			newEventsUnix.push({
				start: element.start,
				end: element.end,
				title: element.title.split('-')[1],
				room: element.room.split(' ')[0],
				instructor: element.instructor,
				textColor: element.font_color,
				remarks: element.remarks,
				color: element.color
			});
		});

		return newEventsUnix;
	}

	function olderThanOneHour(s_date: Date | null): boolean {
		if (!s_date) {
			return true;
		}

		// stores cant store dates, it's a string
		let date = new Date(s_date);
		let currDate = new Date();
		const diffInMs = currDate.getTime() - date.getTime();
		const diffHours = diffInMs / (1000 * 60 * 60);

		return diffHours > 1;
	}

	async function fetchCalendar() {
		isReloading = true;
		const res = await fetch('/api/stundenplan');

		// if (!res.ok) {
		// 	let error = await res.text();
		// 	let payload: ToastPayload = {
		// 		text: error,
		// 		class: ToastPayloadClass.error
		// 	};

		// 	// dispatch('showToast', payload);
		// 	return;
		// }
		loading = false;

		let fetchedCalendar = await res.json();
		let parsedUnix = fetchedToUnixEvents(fetchedCalendar);

		storedEventsUnix!.set(parsedUnix);
		events = unixEventsToEvents(parsedUnix);

		if (events.length > 0) {
			lastEventUpdate.set(new Date());
		}

		isReloading = false;
	}
</script>

<CalendarModal bind:modal {storedEventsUnix}></CalendarModal>

<DashboardTile
	title="Kalender"
	on:reload={() => {
		fetchCalendar();
	}}
	on:click={() => modal?.showModal()}
	ready={$storedEventsUnix && ($storedEventsUnix.length != 0 || !loading)}
	reloadable={true}
	reloading={isReloading}
>
	<TileInteractiveElementWrapper add_class="w-full">
		<div class="flex w-full flex-row items-center justify-between">
			{#if calendarElement}
				<p class="font-bold">{getAltDayString(calendarElement.getOption('date'))}</p>
			{/if}
			<div class="join grid grid-cols-2 gap-0.5">
				<button
					class="btn join-item w-10 rounded-l-full btn-sm btn-accent"
					onclick={() => {
						if (calendarElement) calendarElement.prev();
					}}><FontAwesomeIcon icon={faArrowLeft} /></button
				>
				<button
					class="btn join-item w-10 rounded-r-full btn-sm btn-accent"
					onclick={() => {
						if (calendarElement) calendarElement.next();
					}}><FontAwesomeIcon icon={faArrowRight} /></button
				>
			</div>
		</div>
	</TileInteractiveElementWrapper>
	<span class="tileCalendar w-full">
		<Calendar bind:this={calendarElement} plugins={[List]} {options}></Calendar>
	</span>
</DashboardTile>

<style>
	:global(.tileCalendar .ec-list) {
		width: 100%;
	}
	:global(.tileCalendar .ec-day-head) {
		display: none;
	}
	:global(.tileCalendar .ec-day-bg-color) {
		--ec-day-bg-color: undefined !important;
	}
	:global(.tileCalendar .ec-day) {
		--ec-bg-color: none;
	}
	:global(.tileCalendar .ec) {
		--ec-border-color: none;
	}
</style>
