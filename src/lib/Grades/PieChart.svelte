<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { Chart, PieController, ArcElement, Tooltip } from 'chart.js';

	import type { ExamStats } from '$lib/types';

	export let stats: ExamStats;
	const hasData: boolean = Boolean(stats.successful || stats.unsuccessful || stats.unassessed);

	const chartData = {
		datasets: [
			{
				data: hasData ? [stats.successful, stats.unsuccessful, stats.unassessed] : [10, 1.5, 1],
				backgroundColor: ['#4685af', '#d4163c', '#c1c1c1'],
				borderWidth: 0
			}
		]
	};

	Chart.register(PieController, ArcElement, Tooltip);
	let pieChartElement: HTMLCanvasElement;

	onMount(() => {
		if (browser) {
			new Chart(pieChartElement, {
				type: 'pie',
				data: chartData,
				options: {
					plugins: {
						tooltip: hasData ? {} : { enabled: false }
					}
				}
			});
		}
	});
</script>

<div class="size-28 {hasData ? '' : 'opacity-75 grayscale'}">
	<canvas bind:this={pieChartElement} />
</div>
