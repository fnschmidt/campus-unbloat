import type { Event, EventUnix } from '$lib/types';

export function unixEventsToEvents(uEvents: Array<EventUnix>): Array<Event> {
	const events: Event[] = [];

	uEvents.forEach((event) => {
		events.push({
			...event,
			start: new Date(event.start),
			end: new Date(event.end),
			extendedProps: {
				room: event.room,
				sroom: event.sroom,
				instructor: event.instructor,
				description: event.description,
				remarks: event.remarks
			}
		});
	});

	return events;
}
