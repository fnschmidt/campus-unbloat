<script lang="ts">
	import { dismissToast, getAlertClass, toasts } from '$lib/stores/toast';
	import { ToastPayloadClass } from '$lib/types';
</script>

<!--
	DaisyUI's `toast` component handles the fixed positioning.
	We keep the wrapper `pointer-events-none` so it never blocks the UI,
	and re-enable pointer events on each toast for the close button.
-->
<div class="toast toast-end toast-bottom z-50 pointer-events-none p-4">
	{#each $toasts as t (t.id)}
		<div
			role={t.class === ToastPayloadClass.error ? 'alert' : 'status'}
			class="alert {getAlertClass(
				t.class
			)} pointer-events-auto w-[calc(100vw-2rem)] max-w-sm shadow-lg"
		>
			<span class="min-w-0 flex-1 break-words">{t.text}</span>
			{#if t.dismissible}
				<button
					class="btn btn-ghost btn-sm btn-square"
					aria-label="Close"
					onclick={() => dismissToast(t.id)}
				>
					✕
				</button>
			{/if}
		</div>
	{/each}
</div>
