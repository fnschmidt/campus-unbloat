<script lang="ts">
	import { untrack } from 'svelte';

	import {
		type CampusDualGrade,
		type CampusGradeMetadata,
		type CampusGradeStats
	} from '$lib/types';

	import GradeStatsPopup from '$lib/Popups/GradeStatsPopup.svelte';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faCalendar,
		faChartColumn,
		faCoins,
		faGraduationCap,
		faXmark
	} from '@fortawesome/free-solid-svg-icons';

	let {
		grades,
		modal = $bindable<HTMLDialogElement | null>(null)
	}: { grades: Array<CampusDualGrade>; modal: HTMLDialogElement | null } = $props();

	const totalCps = untrack(() => grades).reduce((sum, item) => sum + item.credit_points, 0);
	const weightedAverage =
		untrack(() => grades).reduce((sum, item) => {
			return sum + parseFloat(item.grade.replace(',', '.')) * item.credit_points; // Convert string to number and add to sum
		}, 0) / totalCps;

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

	let gradeStats: CampusGradeStats | null = $state(null);
	// dirty global used for stats popup
	let myGrade: number = $state(0);
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
</script>

<svelte:window
	on:keydown={() => {
		filterElement?.focus();
	}}
/>

<DashboardModal bind:modal title="Noten">
	<div class="sticky -top-4 z-10 -mt-4 bg-base-100 pt-4 pb-2">
		<div class="flex items-center gap-2">
			<input
				bind:this={filterElement}
				bind:value={filter}
				class="input-bordered input w-full"
				type="text"
				placeholder="Suchen..."
			/>
			<div class="tooltip tooltip-left">
				<div class="tooltip-content max-w-[200px]">
					Gewichteter Durchschnitt: ∑(Note ⋅ ECTS) / Gesamt-ECTS
				</div>
				<div class="badge h-10 p-2 badge-primary">
					<FontAwesomeIcon icon={faGraduationCap} />
					<span class="font-mono">
						{totalCps ? weightedAverage.toPrecision(3) : '...'}
					</span>
				</div>
			</div>
		</div>
	</div>

	{#if filteredGrades && filteredGrades.length > 0}
		<div class="space-y-2">
			{#each filteredGrades as grade, idx (grade)}
				<div class="collapse-arrow collapse bg-base-100 shadow-md">
					<input
						type="checkbox"
						checked={idx === accordionOpenIndex}
						onchange={(e) => {
							accordionOpenIndex = e.currentTarget.checked ? idx : -1;
						}}
					/>

					<div class="collapse-title flex items-center gap-3">
						<span
							class="badge flex-none p-2 font-mono badge-md font-bold {grade.total_passed ===
							undefined
								? 'badge-neutral'
								: grade.total_passed
									? 'badge-success'
									: 'badge-accent'}">{grade.grade}</span
						>
						<span class="text-sm font-bold">{grade.name}</span>
					</div>

					<div class="collapse-content space-y-4">
						<div class="card bg-base-200 shadow">
							<div class="card-body gap-4 p-4">
								<div class="flex items-center gap-3">
									<span class="badge size-7 badge-primary">
										<FontAwesomeIcon icon={faCalendar} />
									</span>
									<div>
										<div class="font-bold">{grade.akad_period}</div>
										<div class="text-sm opacity-60">Akademische Periode</div>
									</div>
								</div>

								<div class="flex items-center gap-3">
									<span class="badge size-7 badge-primary">
										<FontAwesomeIcon icon={faCoins} />
									</span>
									<div>
										<div class="font-bold">{grade.credit_points}</div>
										<div class="text-sm opacity-60">ECTS-Credits</div>
									</div>
								</div>
							</div>
						</div>

						<div class="card bg-base-200 shadow">
							<div class="card-body gap-3 p-4">
								{#each grade.subgrades as subgrade (subgrade)}
									<div class="flex items-center gap-3">
										<span
											class="badge flex-none p-2 font-mono badge-md font-bold {subgrade.passed ===
											undefined
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
												<FontAwesomeIcon icon={faChartColumn} />
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

<dialog class="modal select-none" bind:this={gradeStatsModal}>
	<div class="modal-box max-w-2xl">
		<form method="dialog" class="flex items-center justify-between">
			{#if gradeStats}
				<h4 class="text-center text-lg font-semibold">
					{gradeStats.one +
						gradeStats.two +
						gradeStats.three +
						gradeStats.four +
						gradeStats.ronmodus} Ergebnisse
				</h4>
			{/if}
			<button class="btn btn-circle"><FontAwesomeIcon icon={faXmark} /></button>
		</form>

		<GradeStatsPopup {gradeStats} {myGrade} />
	</div>
	<form method="dialog" class="modal-backdrop"><button>close</button></form>
</dialog>
