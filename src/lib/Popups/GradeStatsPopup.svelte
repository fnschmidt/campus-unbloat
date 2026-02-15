<script lang="ts">
	// import { ProgressRadial } from '@skeletonlabs/skeleton';

	import type { CampusGradeStats } from '$lib/types';
	import GradeStatColumn from './GradeStatColumn.svelte';

	export let gradeStats: CampusGradeStats | null;
	export let myGrade: number;

	let maxValue: number;
	$: if (gradeStats) {
		maxValue = Math.max(...Object.values(gradeStats));
	}
</script>

{#if !(gradeStats && maxValue)}
	<div class="flex h-56 items-center justify-center">
		lade
		<!-- <ProgressRadial
			width="w-20"
			stroke={80}
			value={undefined}
			strokeLinecap="round"
			track="stroke-surface-500/30 dark:stroke-surface-300/30"
		/> -->
	</div>
{:else}
	<h4 class="h4 text-center">
		{gradeStats.one + gradeStats.two + gradeStats.three + gradeStats.four + gradeStats.ronmodus} Ergebnisse
	</h4>

	<div class="bg-secondary-500/10 mt-2 flex h-48 justify-evenly space-x-8 rounded-2xl px-8 pt-1">
		<GradeStatColumn label={1} value={gradeStats.one} {maxValue} isMyGrade={myGrade == 1} />
		<GradeStatColumn label={2} value={gradeStats.two} {maxValue} isMyGrade={myGrade == 2} />
		<GradeStatColumn label={3} value={gradeStats.three} {maxValue} isMyGrade={myGrade == 3} />
		<GradeStatColumn label={4} value={gradeStats.four} {maxValue} isMyGrade={myGrade == 4} />
		<GradeStatColumn label={5} value={gradeStats.ronmodus} {maxValue} isMyGrade={myGrade == 5} />
	</div>
{/if}
<div class="arrow bg-surface-100-800-token"></div>
