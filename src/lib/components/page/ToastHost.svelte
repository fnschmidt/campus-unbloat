<script lang="ts">
	import { dismissToast, getAlertClass, toasts } from '$lib/stores/toast';
	import { ToastPayloadClass } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
</script>

<!--
	DaisyUI's `toast` component handles the fixed positioning.
	We keep the wrapper `pointer-events-none` so it never blocks the UI,
	and re-enable pointer events on each toast for the close button.
-->
<!--
	Position:
	- bottom-center on small screens so it doesn't feel off-screen
	- bottom-right from `lg` upwards (default desktop expectation)
-->
<div class="toast toast-bottom toast-center lg:toast-end z-50 pointer-events-none p-4">
	{#each $toasts as t (t.id)}
		<div
			role={t.class === ToastPayloadClass.error ? 'alert' : 'status'}
			out:fly={{ y: 8, duration: 140 }}
			class="alert {getAlertClass(
				t.class
			)} pointer-events-auto flex w-fit max-w-[calc(100vw-2rem)] items-center gap-3 shadow-lg font-bold"
		>
			<span class="min-w-0 flex-1 wrap-break-word">{t.text}</span>
			{#if t.dismissible}
				<button
					class="btn btn-circle btn-ghost btn-sm ml-auto shrink-0"
					aria-label="Close"
					onclick={() => dismissToast(t.id)}
				>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			{/if}
		</div>
	{/each}
</div>
