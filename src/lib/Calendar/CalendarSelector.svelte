<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';

	import TileInteractiveElementWrapper from '$lib/TilesAndModals/TileInteractiveElementWrapper.svelte';
	import {
		dateIsThisWeek,
		dateIsToday,
		getNextWeekday,
		isSameDate
	} from '$lib/TSHelpers/DateHelper';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

	export let disablePadding = false;
	export let selectedDate: Date = getNextWeekday();
	export let weeklySkibbers: boolean = false;

	const dispatch = createEventDispatcher();
	const isInsideDashboardModal = getContext('dashboardModal') ?? false;

	function dateIsInInterval(week: boolean, selectedDate: Date): boolean {
		if (week) {
			return dateIsThisWeek(selectedDate);
		}

		return isSameDate(selectedDate, getNextWeekday());
	}

	function handleDaySelection(forward: boolean) {
		if (weeklySkibbers) {
			if (forward) {
				selectedDate.setTime(selectedDate.getTime() + 1000 * 60 * 60 * 24 * 7);
			} else {
				selectedDate.setTime(selectedDate.getTime() - 1000 * 60 * 60 * 24 * 7);
			}
		} else {
			const day = selectedDate.getDay();
			let delta: number;

			if (forward) {
				delta = day === 5 ? 3 : day === 6 ? 2 : 1;
			} else {
				delta = day === 1 ? -3 : day === 0 ? -2 : -1;
			}

			selectedDate.setDate(selectedDate.getDate() + delta);
		}

		dispatch('dateChanged', selectedDate);
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (isInsideDashboardModal) {
			if (e.key == 'ArrowLeft') handleDaySelection(false);
			else if (e.key == 'ArrowRight') handleDaySelection(true);
		}
	}}
/>

<!-- -mb-2 hack for calendar having a bit of blank space -->
<div
	class="flex flex-row {disablePadding
		? '-mb-2'
		: 'pb-2'} w-full items-center justify-between space-x-1"
>
	<TileInteractiveElementWrapper>
		<button
			on:click={() => handleDaySelection(false)}
			aria-label={weeklySkibbers ? 'vorherige Woche' : 'vorherige Tag'}
			class="variant-filled-primary btn btn-circle size-10 shrink-0"
		>
			<!-- <i class="fa-solid fa-arrow-left" /> -->
			<FontAwesomeIcon icon={faArrowLeft} />
		</button>
	</TileInteractiveElementWrapper>
	<button
		on:click|stopPropagation={() => {
			if (weeklySkibbers) {
				if (!dateIsThisWeek(selectedDate)) dispatch('setToToday');
			} else {
				if (!dateIsToday(selectedDate)) dispatch('setToToday');
			}
		}}
		class="{dateIsInInterval(weeklySkibbers, selectedDate)
			? 'pointer-events-none opacity-40'
			: ''} dont-open-modal bg-surface-200-700-token border-surface-400-500-token btn h-[42px] w-1/3 shrink-0 border transition-transform hover:brightness-105"
	>
		<p>{weeklySkibbers ? 'Diese Woche' : 'Heute'}</p>
	</button>

	<TileInteractiveElementWrapper>
		<button
			on:click={() => handleDaySelection(true)}
			aria-label={weeklySkibbers ? 'nächste Woche' : 'nächster Tag'}
			class="variant-filled-primary btn btn-circle size-10 shrink-0 self-end"
		>
			<!-- <i class="fa-solid fa-arrow-right" /> -->
			<FontAwesomeIcon icon={faArrowRight} />
		</button>
	</TileInteractiveElementWrapper>
</div>
