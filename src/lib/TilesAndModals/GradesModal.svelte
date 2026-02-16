<script lang="ts">
	// import {
	// 	Accordion,
	// 	AccordionItem,
	// 	getToastStore,
	// 	popup,
	// 	type PopupSettings
	// } from '@skeletonlabs/skeleton';
	import { untrack } from 'svelte';

	import {
		// getToastSettings,
		// ToastPayloadClass,
		type CampusDualGrade,
		type CampusGradeMetadata,
		type CampusGradeStats
	} from '$lib/types';
	// import DashboardModal from '$lib/DashboardModal.svelte';
	import GradeStatsPopup from '$lib/Popups/GradeStatsPopup.svelte';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCalendar } from '@fortawesome/free-solid-svg-icons';

	let {
		grades,
		modal = $bindable<HTMLDialogElement | null>(null)
	}: { grades: Array<CampusDualGrade>; modal: HTMLDialogElement | null } = $props();

	// let modal: HTMLDialogElement | null = $state(null);

	const totalCps = untrack(() => grades).reduce((sum, item) => sum + item.credit_points, 0);
	const weightedAverage =
		untrack(() => grades).reduce((sum, item) => {
			return sum + parseFloat(item.grade.replace(',', '.')) * item.credit_points; // Convert string to number and add to sum
		}, 0) / totalCps;
	// const popupAvgInfo: PopupSettings = {
	// 	event: 'hover',
	// 	target: 'popupAvgInfo',
	// 	placement: 'left'
	// };

	// const toastStore = getToastStore();

	let filteredGrades: Array<CampusDualGrade> = $state(untrack(() => grades));

	let filter = $state('');
	let filterElement: HTMLInputElement;
	$effect(() => {
		filterGrades(filter);
	});

	// hack to emulate "autocollapse" while being able to collapse the remaining
	let accordionOpenIndex = $state(0);

	function filterGrades(filter: string) {
		accordionOpenIndex = 0;

		if (filter == '') {
			filteredGrades = grades;
		} else if (filter) {
			const words = filter.split(' ').map((word) => word.trim().toLowerCase());
			filteredGrades = grades.filter((grade) =>
				words.every((word) => grade.name.toLowerCase().includes(word))
			);
		}
	}

	let gradeStats: CampusGradeStats | null = null;
	// dirty global used for stats popup
	let myGrade = 0;
	let gradeStatsModal: HTMLDialogElement | null = null;

	async function getGradeStats(internal_metadata?: CampusGradeMetadata) {
		gradeStats = null;
		const response = await fetch('/api/gradestats', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(internal_metadata)
		});

		if (!response.ok) {
			window.alert('todo');
			// const toastSettings = getToastSettings({
			// 	text: await response.text(),
			// 	class: ToastPayloadClass.error
			// });
			// toastStore.trigger(toastSettings);
			// return;
		} else {
			gradeStats = await response.json();
		}
	}

	function getRoundedGrade(grade: string): number {
		const float = parseFloat(grade.replace(',', '.'));
		if (isNaN(float)) return 0;

		return Math.round(float);
	}

	// // separate popups to work around some bug in a dependency
	// function getPopupGradeStats(qual: string): PopupSettings {
	// 	const setting: PopupSettings = {
	// 		state(event) {
	// 			// dirty workaround for race condition
	// 			setTimeout(() => {
	// 				popupOpen = event.state;
	// 			}, 100);
	// 		},
	// 		event: 'click',
	// 		target: 'popupGradeStats-' + qual,
	// 		placement: 'top'
	// 	};

	// 	return setting;
	// }
</script>

<svelte:window
	on:keydown={() => {
		filterElement?.focus();
	}}
/>

<!-- <div class="card p-4 shadow-xl z-50" data-popup="popupAvgInfo">
	<p class="font-bold">Gewichteter Durchschnitt</p>
	<p class="text-center text-xs">∑(Note ⋅ ECTS) / Gesamt-ECTS</p>
	<div class="arrow bg-surface-100-800-token" />
</div> -->

<!-- {#each grades as gr (gr)}
	{#each gr.subgrades as sg (sg)}
		<div
			class="card p-2 w-80 shadow-2xl z-50"
			data-popup="popupGradeStats-{sg.name + sg.bekanntgabe}"
		>
			<GradeStatsPopup bind:gradeStats bind:myGrade />
		</div>
	{/each}
{/each} -->

<!-- <button
	aria-label="Anordnung ändern"
	onclick={() => modal?.showModal()}
	class="btn btn-circle btn-primary"
	><Move size={18} />
</button> -->

<DashboardModal bind:modal title="Noten">
	<div class="flex items-center gap-2">
		<input
			bind:this={filterElement}
			bind:value={filter}
			class="input-bordered input w-full"
			type="text"
			placeholder="Suchen..."
		/>
		<div
			class="tooltip tooltip-left"
			data-tip="Gewichteter Durchschnitt: ∑(Note ⋅ ECTS) / Gesamt-ECTS"
		>
			<div class="badge gap-2 badge-lg badge-primary">
				<i class="fa-solid fa-graduation-cap pointer-events-none"></i>
				<span class="pointer-events-none font-mono">
					{totalCps ? weightedAverage.toPrecision(3) : '...'}
				</span>
			</div>
		</div>
	</div>

	{#if filteredGrades && filteredGrades.length > 0}
		<div class="space-y-2">
			{#each filteredGrades as grade, idx (grade)}
				<div class="collapse-arrow collapse bg-base-200">
					<input
						type="checkbox"
						checked={idx === accordionOpenIndex}
						onchange={(e) => {
							accordionOpenIndex = e.currentTarget.checked ? idx : -1;
						}}
					/>

					<div class="collapse-title flex items-center gap-3">
						<span
							class="badge flex-none badge-lg {grade.total_passed === undefined
								? 'badge-neutral'
								: grade.total_passed
									? 'badge-success'
									: 'badge-accent'}">{grade.grade}</span
						>
						<span class="font-medium">{grade.name}</span>
					</div>

					<div class="collapse-content space-y-4">
						<div class="card bg-base-100 shadow">
							<div class="card-body gap-4 p-4">
								<div class="flex items-center gap-3">
									<span class="badge badge-outline">
										<!-- <i class="fa-solid fa-calendar"></i> -->
										 <FontAwesomeIcon icon={faCalendar} />
										 <!-- <Calendar fill="white"></Calendar> -->
									</span>
									<div>
										<div class="font-bold">{grade.akad_period}</div>
										<div class="text-sm opacity-60">Akademische Periode</div>
									</div>
								</div>

								<div class="flex items-center gap-3">
									<span class="badge badge-outline">
										<i class="fa-solid fa-coins"></i>
									</span>
									<div>
										<div class="font-bold">{grade.credit_points}</div>
										<div class="text-sm opacity-60">ECTS-Credits</div>
									</div>
								</div>
							</div>
						</div>

						<div class="card bg-base-100 shadow">
							<div class="card-body gap-3 p-4">
								{#each grade.subgrades as subgrade (subgrade)}
									<div class="flex items-center gap-3">
										<span
											class="badge flex-none badge-lg {subgrade.passed === undefined
												? 'badge-neutral'
												: subgrade.passed
													? 'badge-success'
													: 'badge-accent'}">{subgrade.grade}</span
										>

										<div class="min-w-0 flex-auto">
											<div class="truncate text-sm">{subgrade.name}</div>
											<div class="text-sm opacity-60">
												{subgrade.wiederholung ? `${subgrade.wiederholung} ⋅ ` : ''}Bekanntgabe:
												{subgrade.bekanntgabe} ⋅ {subgrade.akad_period}
											</div>
										</div>

										{#if Boolean(subgrade.internal_metadata)}
											<button
												aria-label="Ergebnisse aller Studenten anzeigen"
												onclick={() => {
													myGrade = getRoundedGrade(subgrade.grade);
													gradeStatsModal?.showModal();
													getGradeStats(subgrade.internal_metadata);
												}}
												class="btn btn-square shrink-0 btn-sm btn-primary"
											>
												<i class="fa-solid fa-chart-column"></i>
											</button>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="py-8 text-center">
			<p class="text-lg opacity-70">Keine Noten gefunden.</p>
		</div>
	{/if}
</DashboardModal>

<dialog class="modal" bind:this={gradeStatsModal}>
	<div class="modal-box max-w-3xl">
		<form method="dialog">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				aria-label="Schließen"
			>
				✕
			</button>
		</form>

		<GradeStatsPopup {gradeStats} {myGrade} />
	</div>
	<form method="dialog" class="modal-backdrop"><button>close</button></form>
</dialog>
