<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import ExamSignupModal from './ExamSignupModal.svelte';

	let modal: HTMLDialogElement | null = $state(null);
</script>

<ExamSignupModal bind:modal></ExamSignupModal>

<DashboardTile title="Prüfungen" on:click={() => modal?.showModal()} ready={Boolean(modal)}>
	click me
</DashboardTile>
