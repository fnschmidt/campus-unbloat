export function getDateAsUrlParam(date: Date): string {
	const year = date.getFullYear();
	const month = padIt((date.getMonth() + 1).toString());
	const day = padIt(date.getDate().toString());
	return `${year}-${month}-${day}`;
}

function getNextMonday(date: Date): Date {
	const day = date.getDay();
	const daysToAdd = day === 0 ? 1 : 7 - day + 1;
	date.setDate(date.getDate() + daysToAdd);
	return date;
}

export function getNextWeekday(): Date {
	const today = new Date();
	const day = today.getDay();

	if (day === 6 || day === 0) {
		// Saturday or Sunday
		return getNextMonday(today);
	}

	return today;
}

export function getAltDayString(selectedDate: Date): string {

	// date is guaranteed to not be today
	let today = new Date();
	// dates have to be set to YYYY-MM-DD only, so that the rounding in getDiffInDays won't get mixed up in hours/minutes/seconds from events
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

	const diffInDays = getDiffInDays(selectedDate, today);
	const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

	switch (diffInDays) {
		case -1:
			return 'Gestern';
		case 1:
			return 'Morgen';
		default:
			return `${weekDays[selectedDate.getDay()]}, ${padIt(String((selectedDate.getDate())))}.${padIt(String(selectedDate.getMonth() + 1))}.`;
	}
}

export function padIt(toBePadded?: string) : string {
	if(toBePadded == null || toBePadded == undefined) {
		return "";
	}
	
	return toBePadded.padStart(2, '0');
}

export function getDiffInDays(date1: Date, date2: Date): number {
	// Get the difference in milliseconds
	const diffInMs = date1.getTime() - date2.getTime();
	// Convert milliseconds to days
	const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
	// Return the difference in days, rounded to the nearest integer
	return Math.round(diffInDays);
}

export function dateIsToday(date: Date): boolean {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}
