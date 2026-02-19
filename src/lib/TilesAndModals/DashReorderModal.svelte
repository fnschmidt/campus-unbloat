<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	import { tileNames, validateComponentOrder } from '$lib/TSHelpers/ComponentOrder';
	import { faBars, faUpDownLeftRight, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	let modal: HTMLDialogElement | null = $state(null);

	let { componentOrder }: { componentOrder: Writable<string[]> } = $props();

	let items = $derived($componentOrder?.map((id) => ({ id, title: tileNames.get(id) })));

	function handleSort(e: CustomEvent) {
		items = e.detail.items;
	}

	function finalize(e: CustomEvent) {
		handleSort(e);
		let newSort = items.map((item) => item.id);

		if (!validateComponentOrder(newSort)) {
			window.alert('Reorder failed');
		} else {
			componentOrder.set(newSort);
		}
	}
</script>

<button
	aria-label="Anordnung ändern"
	onclick={() => modal?.showModal()}
	class="btn btn-circle btn-primary"
	><FontAwesomeIcon icon={faUpDownLeftRight} />
</button>

{#if items}
	<!--Dialog Element um Modal zu definieren-->
	<dialog class="modal" bind:this={modal}>
		<div class="modal-box">
			<!--Knopf zum schließen des Modals-->
			<form method="dialog">
				<button class="btn btn-circle"><FontAwesomeIcon icon={faXmark} /></button>
			</form>

			<div
				class="grid grid-cols-1 gap-2 lg:grid-cols-2"
				use:dndzone={{ items, dropTargetStyle: {}, flipDurationMs: 200 }}
				onconsider={handleSort}
				onfinalize={finalize}
			>
				{#each items as item (item.id)}
					<div
						animate:flip={{ duration: 200 }}
						class="rounded-token flex items-center bg-[#ddb8c1] px-4 py-2 dark:bg-[#3b1725]"
					>
						<p class="grow">{item.title}</p>
						<FontAwesomeIcon icon={faBars} />
					</div>
				{/each}
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
{/if}
