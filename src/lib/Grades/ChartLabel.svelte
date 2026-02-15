<script lang="ts">
	export let label: string;
	export let value: number;
	export let total: number;
	export let color: string;

	function getPercentLabel() {
		return `${Math.round((value / total) * 100)}%`;
	}

	console.log(color);
</script>

<!-- <li class="conic-item bg-primary-hover-token">
	<span
		class="conic-swatch block aspect-square bg-black w-5 rounded-full mr-2"
		style="background: {color};"
	></span> <span class="conic-label flex-auto">{label}</span>
	<strong class="conic-value">{getPercentLabel()}</strong>
</li> -->
<li class="rounded-btn flex w-40 items-center space-y-1 hover:bg-base-200">
	<span class="block h-5 w-5 shrink-0 rounded-full" style="background-color: {color};"></span>

	<span class="flex-1">{label}</span>
	<strong>{getPercentLabel()}</strong>
</li>
