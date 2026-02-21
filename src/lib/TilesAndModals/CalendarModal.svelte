<script lang="ts">
	import { type Event, type EventUnix } from '$lib/types';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import type { Writable } from 'svelte/store';
	// import { Calendar } from '@fullcalendar/core';
	// import timeGridPlugin from '@fullcalendar/timegrid';
	import { onMount } from 'svelte';
	import { Calendar, TimeGrid } from '@event-calendar/core';

	let {
		modal = $bindable<HTMLDialogElement | null>(null),
		storedEventsUnix
	}: {
		modal: HTMLDialogElement | null;
		storedEventsUnix: Writable<EventUnix[]> | undefined;
	} = $props();

	let events: Event[] | undefined = $derived(
		$storedEventsUnix?.map((ev) => ({
			...ev,
			start: new Date(ev.start),
			end: new Date(ev.end),
			extendedProps: {
				room: ev.room,
				instructor: ev.instructor
			}
		}))
	);

	type Content = string | { html: string } | { domNodes: Node[] };

	interface ModuleEvent {
		// id: number | string;
		// start: Date;
		// end: Date;
		// resourceIds: Array<number | string>;
		// allDay: boolean;
		title: Content;
		// editable: boolean | undefined;
		// startEditable: boolean | undefined;
		// durationEditable: boolean | undefined;
		// display: 'auto' | 'background' | 'ghost' | 'preview' | 'pointer';
		// backgroundColor: string | undefined;
		// textColor: string | undefined;
		// classNames: string[];
		// styles: string[];
		extendedProps: Record<string, unknown>;
	}

	type dayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
	interface contentInfo {
		event: ModuleEvent;
		timeText: string;
		// view: View;
	}
	// interface View {
	// 	type: string;
	// 	// title: string;
	// 	// currentStart: Date;
	// 	// currentEnd: Date;
	// 	// activeStart: Date;
	// 	// activeEnd: Date;
	// }

	const hiddenDays: dayOfWeek[] = [0, 6];
	// const calDefaultMinHour = 8;
	// const calDefaultMin = `${String(calDefaultMinHour).padStart(2, '0')}:00:00`;
	// const calDefaultMaxHour = 18;
	// const calDefaultMax = `${String(calDefaultMaxHour).padStart(2, '0')}:00:00`;

	let options = $derived({
		view: 'timeGridWeek',
		events: events ?? [],
		height: '100%',
		allDaySlot: false,
		hiddenDays: hiddenDays,
		// slotMinTime: calDefaultMin,
		// slotMaxTime: calDefaultMax,
		eventClick: (info: unknown) => {
			console.log(info);
		},
		eventContent: (info: contentInfo) => {
			return `${info.timeText}\n${info.event.title}${info.event.extendedProps.room ? `, Raum ${info.event.extendedProps.room}` : ''}`;
		}

		// eventContent: (info: EventContentInfo) => {
		// 	// // console.log(info.event);
		// 	// console.log(info);
		// 	// return "11:00\nZSPM2";
		// 	// return "abc";
		// }

		// EventSources: $storedEventsUnix,
		// events: $storedEventsUnix
	});

	onMount(() => {
		// const modalBox = modal?.querySelector<HTMLElement>('.modal-box');
		// const onTransitionEnd = (e: TransitionEvent) => {
		// 	if (e.propertyName === 'translate') {
		// 		calendar.updateSize();
		// 	}
		// };
		// modalBox?.addEventListener('transitionend', onTransitionEnd);
		// let calendarEl: HTMLElement = document.getElementById('calendar')!;
		// let calendar = new Calendar(calendarEl, {
		// 	datesSet(info) {
		// 		const viewStart = info.start.getTime();
		// 		const viewEnd = info.end.getTime();
		// 		const eventsInView = $storedEventsUnix.filter(
		// 			(e) => e.end > viewStart && e.start < viewEnd
		// 		);
		// 		if (eventsInView.length) {
		// 			const minStart = Math.min(...eventsInView.map((e) => e.start));
		// 			const maxEnd = Math.max(...eventsInView.map((e) => e.end));
		// 			const minDate = new Date(minStart);
		// 			const maxDate = new Date(maxEnd);
		// 			const pad = (n: number) => String(n).padStart(2, '0');
		// 			const toTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
		// 			if (minDate.getHours() < calDefaultMinHour) {
		// 				calendar.setOption('slotMinTime', toTime(minDate));
		// 			} else {
		// 				calendar.setOption('slotMinTime', calDefaultMin);
		// 			}
		// 			if (maxDate.getHours() > calDefaultMaxHour) {
		// 				calendar.setOption('slotMaxTime', toTime(maxDate));
		// 			} else {
		// 				calendar.setOption('slotMaxTime', calDefaultMax);
		// 			}
		// 		} else {
		// 			calendar.setOption('slotMinTime', calDefaultMin);
		// 			calendar.setOption('slotMaxTime', calDefaultMax);
		// 		}
		// 	},
		// 	plugins: [timeGridPlugin],
		// 	initialView: 'timeGridWeekdays',
		// 	initialEvents: $storedEventsUnix,
		// 	locale: 'de',
		// 	weekends: false,
		// 	slotMinTime: calDefaultMin,
		// 	slotMaxTime: calDefaultMax,
		// 	height: '100%',
		// 	// handleWindowResize: false,
		// 	views: {
		// 		timeGridWeekdays: {
		// 			type: 'timeGridWeek',
		// 			allDaySlot: false
		// 		}
		// 	}
		// });
		// // console.log("init", calendarEl.getBoundingClientRect());
		// calendar.render();
	});
</script>

<DashboardModal bind:modal title="Kalender">
	<!-- <div id="calendar"></div> -->

	<Calendar plugins={[TimeGrid]} {options} />
</DashboardModal>
