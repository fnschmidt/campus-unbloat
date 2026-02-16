<script lang="ts">
	export let label: number;
	export let value: number;
	export let maxValue: number;
	export let isMyGrade: boolean;

	let percentage = Math.round((value / maxValue) * 75); // 75% is max due to bar label/value taking up vspace
</script>

<div class="flex h-full w-full flex-col items-center justify-end gap-1">
	<div class="text-sm font-medium">{value}</div>
	<div
		class="w-full rounded-t {isMyGrade ? 'bg-primary' : 'bg-base-content/20'}"
		style="height: {percentage}%;"
	></div>
	<div class="text-xs opacity-70">{label}</div>
</div>
