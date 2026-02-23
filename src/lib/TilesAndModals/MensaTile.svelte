<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import MensaModal from './MensaModal.svelte';

	let modal: HTMLDialogElement | null = $state(null);
</script>

<MensaModal bind:modal></MensaModal>

<DashboardTile title="Mensa" on:click={() => modal?.showModal()} ready={Boolean(modal)}>
	click me
</DashboardTile>
