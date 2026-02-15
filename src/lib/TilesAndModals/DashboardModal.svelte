<script lang="ts">
	import { X } from '@lucide/svelte';

	let { modal = $bindable<HTMLDialogElement | null>(null), children } = $props();
</script>

<dialog class="modal" bind:this={modal}>
	<div class="modal-box">
		<!--Knopf zum schließen des Modals-->
		<form method="dialog">
			<button class="absolute top-3 right-3 btn-circle btn-xs btn-accent"><X /></button>
		</form>

		{@render children()}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
