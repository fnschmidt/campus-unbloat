<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faCalendarDays,
		faClock,
		faDoorOpen,
		faInfo,
		faPlus,
		faUser
	} from '@fortawesome/free-solid-svg-icons';

	let {
		modal = $bindable<HTMLDialogElement | null>(null),
		event = $bindable<unknown | null>(null)
	} = $props();

	const formatEventTime = (eventData: unknown) => {
		const start =
			eventData && typeof eventData === 'object'
				? (eventData as { start?: Date }).start
				: undefined;
		const end =
			eventData && typeof eventData === 'object' ? (eventData as { end?: Date }).end : undefined;
		if (!(start instanceof Date)) return undefined;
		const formatTime = (date: Date) =>
			date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
		const startText = formatTime(start);
		if (!(end instanceof Date)) return `${startText} Uhr`;
		return `${startText}-${formatTime(end)} Uhr`;
	};

	const getTitleText = (eventData: unknown) => {
		const title =
			eventData && typeof eventData === 'object'
				? (eventData as { title?: unknown }).title
				: undefined;
		if (typeof title === 'string') return title;
		if (title && typeof title === 'object' && 'html' in title) {
			const htmlTitle = (title as { html?: string }).html;
			return typeof htmlTitle === 'string' ? htmlTitle : undefined;
		}
		return undefined;
	};

	const getExtendedProp = (eventData: unknown, key: string) => {
		const extendedProps =
			eventData && typeof eventData === 'object'
				? (eventData as { extendedProps?: Record<string, unknown> }).extendedProps
				: undefined;
		const value = extendedProps?.[key];
		return typeof value === 'string' ? value : undefined;
	};
</script>

<dialog bind:this={modal} class="modal select-none">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">✕</button>
		</form>
		<h3 class="text-lg font-bold">Termininfo</h3>
		{#if event}
			<div class="space-y-3 py-4">
				<p class="flex items-center gap-2">
					<FontAwesomeIcon icon={faCalendarDays} />
					<span class="font-semibold">Modul:</span>
					<span>{getTitleText(event) ?? '-'}</span>
				</p>
				<p class="flex items-center gap-2">
					<FontAwesomeIcon icon={faClock} />
					<span class="font-semibold">Zeit:</span>
					<span>{formatEventTime(event) ?? '-'}</span>
				</p>
				<p class="flex items-center gap-2">
					<FontAwesomeIcon icon={faDoorOpen} />
					<span class="font-semibold">Raum:</span>
					<span>{getExtendedProp(event, 'room') ?? '-'}</span>
				</p>
				<p class="flex items-center gap-2">
					<FontAwesomeIcon icon={faUser} />
					<span class="font-semibold">Dozent:</span>
					<span>{getExtendedProp(event, 'instructor') ?? '-'}</span>
				</p>
				{#if getExtendedProp(event, 'description')}
					<p class="flex items-center gap-2">
						<FontAwesomeIcon icon={faInfo} />
						<span>{getExtendedProp(event, 'description')}</span>
					</p>
				{/if}
				{#if getExtendedProp(event, 'remarks')}
					<p class="flex items-center gap-2">
						<FontAwesomeIcon icon={faPlus} />
						<span class="font-semibold">Info:</span>
						<span>{getExtendedProp(event, 'remarks')}</span>
					</p>
				{/if}
			</div>
		{:else}
			<p class="py-4">Keine Details verfügbar.</p>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
