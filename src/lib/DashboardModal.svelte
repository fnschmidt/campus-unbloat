<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';
	let { modal = $bindable<HTMLDialogElement | null>(null), children, title } = $props();
</script>

<dialog class="modal" bind:this={modal}>
	<!-- volle Höhe, Column-Layout, nur Content scrollt -->
	<div
		class="modal-box flex h-full w-full max-w-full flex-col overflow-hidden rounded-none p-0 lg:h-[calc(100%-80px)] lg:w-3xl lg:rounded-2xl"
	>
		<!-- Header: overlay, translucent + Blur -->
		<div
			class="absolute inset-x-0 top-0 z-30 h-16 border-b border-b-base-300 bg-base-100/90 backdrop-blur-lg"
		>
			<div class="flex h-full w-full items-center justify-between px-4 select-none">
				<h3 class="text-lg font-bold">{title}</h3>
				<div class="m-0 modal-action">
					<form method="dialog">
						<button class="btn btn-circle"><FontAwesomeIcon icon={faXmark} /></button>
					</form>
				</div>
			</div>
		</div>

		<!-- Scrollbarer Bereich: Content geht unter den Header -->
		<div class="modalBody min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable_both-edges]">
			<!-- Spacer gleicht die überlappende Header-Höhe aus -->
			<div class="h-16 shrink-0"></div>
			<div
				class="flex h-[calc(100%-64px)] flex-col overflow-y-auto p-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]"
			>
				{@render children()}
			</div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
