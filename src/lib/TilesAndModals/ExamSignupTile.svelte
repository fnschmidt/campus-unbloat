<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import type { CampusDualSignupOption } from '$lib/types';
	import { onMount } from 'svelte';
	import ExamSignupModal from './ExamSignupModal.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSquareCheck, faSquarePen } from '@fortawesome/free-solid-svg-icons';

	let modal: HTMLDialogElement | null = $state(null);

	let signupOptions: Array<CampusDualSignupOption> | null = $state(null);
	let signUppable: number | null = $state(null);

	onMount(async () => {
		fetchStuff();
	});

	async function fetchStuff() {
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

{#if signupOptions}
	<ExamSignupModal bind:modal></ExamSignupModal>
{/if}

<DashboardTile title="Prüfungen" on:click={() => modal?.showModal()} ready={Boolean(modal)}>
	<div class="flex items-center">
		{#if signUppable != null}
			<div class="flex flex-col">
				<!-- <div class="relative -top-1 left-3 -mb-6 size-6 rounded bg-base-100"></div> -->
				<FontAwesomeIcon
					class={signUppable === 0 ? 'text-primary' : 'text-accent'}
					size="2xl"
					icon={signUppable === 0 ? faSquareCheck : faSquarePen}
				/>
				<!-- <i
					class={'fa-solid w-12 scale-[2] ' +
						(signUppable === 0 ? 'fa-square-check text-secondary' : 'fa-square-pen text-primary')}
				></i> -->
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
