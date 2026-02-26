<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import type { CampusDualSignupOption } from '$lib/types';
	import { onMount } from 'svelte';
	import ExamSignupModal from './ExamSignupModal.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSquareCheck, faSquarePen } from '@fortawesome/free-solid-svg-icons';

	let { onExamSignupOrCancel = () => {} }: { onExamSignupOrCancel?: () => void } = $props();

	let modal: HTMLDialogElement | null = $state(null);

	let signupOptions: Array<CampusDualSignupOption> | null = $state(null);
	let signUppable: number | null = $state(null);

	onMount(async () => {
		fetchStuff();
	});

	async function fetchStuff() {
		modal?.close();
		signupOptions = null;

		const res1 = await fetch('/api/examsignup');

		if (!res1.ok) {
			let error = await res1.text();
			window.alert(error);
		} else {
			signupOptions = await res1.json();
			signUppable = signupOptions!.filter((op) => op.status === '📝').length;
		}
	}
</script>

<ExamSignupModal
	bind:modal
	{signupOptions}
	onExamSignupOrCancel={() => (onExamSignupOrCancel(), fetchStuff())}
></ExamSignupModal>

<DashboardTile title="Prüfungen" on:click={() => modal?.showModal()} ready={signupOptions !== null}>
	<div class="flex items-center py-4">
		{#if signUppable != null}
			<div class="flex flex-col">
				{#if signUppable === 0}
					<FontAwesomeIcon class="text-primary" size="2xl" icon={faSquareCheck} />
				{:else}
					<FontAwesomeIcon class="text-accent" size="2xl" icon={faSquarePen} />
				{/if}
			</div>
			<div class="ml-1 h-full border-l border-base-300 pr-3"></div>
			<div class="text-left">
				Du kannst dich für
				<p class="font-bold">
					{signUppable} Prüfung{signUppable !== 1 ? 'en' : ''}
				</p>
				anmelden.
			</div>
		{/if}
	</div>
</DashboardTile>
