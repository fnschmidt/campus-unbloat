<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { faUtensils } from '@fortawesome/free-solid-svg-icons';
	import MensaModal from './MensaModal.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	let modal: HTMLDialogElement | null = $state(null);
</script>

<MensaModal bind:modal></MensaModal>

<DashboardTile title="Mensa" on:click={() => modal?.showModal()} ready={Boolean(modal)}>
	<div class="flex flex-col items-center gap-3">
		<div class="stack h-20 w-28">
			<div class="grid place-content-center rounded-box bg-primary text-primary-content">
				<FontAwesomeIcon size="xl" icon={faUtensils} />
			</div>
			<div class="rounded-box bg-primary"></div>
			<div class="rounded-box bg-primary"></div>
		</div>

		Tippe, um Gerichte anzuzeigen
	</div>
</DashboardTile>
