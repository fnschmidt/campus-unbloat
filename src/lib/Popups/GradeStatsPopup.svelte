<script lang="ts">
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
	<div class="flex h-48 flex-col items-center justify-center gap-3">
		<span class="loading loading-xl loading-dots"></span>
	</div>
{:else}
	<div class="mt-3 flex h-48 justify-evenly gap-8 rounded-box bg-base-200 px-8 pt-2">
		<GradeStatColumn label={1} value={gradeStats.one} {maxValue} isMyGrade={myGrade == 1} />
		<GradeStatColumn label={2} value={gradeStats.two} {maxValue} isMyGrade={myGrade == 2} />
		<GradeStatColumn label={3} value={gradeStats.three} {maxValue} isMyGrade={myGrade == 3} />
		<GradeStatColumn label={4} value={gradeStats.four} {maxValue} isMyGrade={myGrade == 4} />
		<GradeStatColumn label={5} value={gradeStats.ronmodus} {maxValue} isMyGrade={myGrade == 5} />
	</div>
{/if}
