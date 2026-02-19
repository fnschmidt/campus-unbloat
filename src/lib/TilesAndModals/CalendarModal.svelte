<script lang="ts">
	import { type EventUnix } from '$lib/types';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import type { Writable } from 'svelte/store';
	import { Calendar } from '@fullcalendar/core';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import { onMount } from 'svelte';

	let {
		modal = $bindable<HTMLDialogElement | null>(null),
		storedEventsUnix
	}: {
		modal: HTMLDialogElement | null;
		storedEventsUnix: Writable<EventUnix[]>;
	} = $props();

	onMount(() => {
		const modalBox = modal?.querySelector<HTMLElement>('.modal-box');
		const onTransitionEnd = (e: TransitionEvent) => {
			if (e.propertyName === 'translate') {
				calendar.updateSize();
			}
		};

		modalBox?.addEventListener('transitionend', onTransitionEnd);

		const calDefaultMinHour = 8;
		const calDefaultMin = `${String(calDefaultMinHour).padStart(2, '0')}:00:00`;
		const calDefaultMaxHour = 18;
		const calDefaultMax = `${String(calDefaultMaxHour).padStart(2, '0')}:00:00`;

		let calendarEl: HTMLElement = document.getElementById('calendar')!;

		let calendar = new Calendar(calendarEl, {
			datesSet(info) {
				const viewStart = info.start.getTime();
				const viewEnd = info.end.getTime();

				const eventsInView = $storedEventsUnix.filter(
					(e) => e.end > viewStart && e.start < viewEnd
				);

				if (eventsInView.length) {
					const minStart = Math.min(...eventsInView.map((e) => e.start));
					const maxEnd = Math.max(...eventsInView.map((e) => e.end));

					const minDate = new Date(minStart);
					const maxDate = new Date(maxEnd);

					const pad = (n: number) => String(n).padStart(2, '0');
					const toTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

					if (minDate.getHours() < calDefaultMinHour) {
						calendar.setOption('slotMinTime', toTime(minDate));
					} else {
						calendar.setOption('slotMinTime', calDefaultMin);
					}
					if (maxDate.getHours() > calDefaultMaxHour) {
						calendar.setOption('slotMaxTime', toTime(maxDate));
					} else {
						calendar.setOption('slotMaxTime', calDefaultMax);
					}
				} else {
					calendar.setOption('slotMinTime', calDefaultMin);
					calendar.setOption('slotMaxTime', calDefaultMax);
				}
			},
			plugins: [timeGridPlugin],
			initialView: 'timeGridWeekdays',
			initialEvents: $storedEventsUnix,
			locale: 'de',
			weekends: false,
			slotMinTime: calDefaultMin,
			slotMaxTime: calDefaultMax,
			height: '100%',
			// handleWindowResize: false,
			views: {
				timeGridWeekdays: {
					type: 'timeGridWeek',
					allDaySlot: false
				}
			}
		});

		// console.log("init", calendarEl.getBoundingClientRect());
		calendar.render();
	});
</script>

<DashboardModal bind:modal title="Kalender">
	<div id="calendar"></div>
</DashboardModal>
