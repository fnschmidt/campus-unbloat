<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';

	let {
		modal = $bindable<HTMLDialogElement | null>(null)
	}: {
		modal: HTMLDialogElement | null;
	} = $props();
</script>

<DashboardModal bind:modal title="Mensa">
	<div class="sticky -top-4 z-10 -mx-2 -mt-4 bg-base-100 p-2 pt-4">hier selector</div>

	hier viel
</DashboardModal>
