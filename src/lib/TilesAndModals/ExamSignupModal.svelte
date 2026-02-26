<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import {
		SignupOrVerfahren,
		ToastPayloadClass,
		type CampusDualSignupOption,
		type CampusDualVerfahrenOption,
		type ToastPayload
	} from '$lib/types';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import ExamSignupAccordion from '$lib/ExamSignup/ExamSignupAccordion.svelte';

	let {
		modal = $bindable<HTMLDialogElement | null>(null),
		signupOptions = [],
		onExamSignupOrCancel = () => {}
	}: {
		modal: HTMLDialogElement | null;
		signupOptions: Array<CampusDualSignupOption> | null;
		onExamSignupOrCancel?: () => void;
	} = $props();

	const dispatch = createEventDispatcher();

	let verfahrenOptions: Array<CampusDualVerfahrenOption> | null = $state(null);
	let signupOrVerfahren = $state(SignupOrVerfahren.signup);

	async function loadVerfahrenOptions() {
		const res = await fetch('/api/examverfahren');
		if (!res.ok) {
			const error = await res.text();
			const payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};
			dispatch('showToast', payload);
			return;
		}

		verfahrenOptions = await res.json();
	}

	$effect(() => {
		if (!modal) {
			return;
		}

		const handleToggle = () => {
			if (modal?.open) {
				loadVerfahrenOptions();
			}
		};

		modal.addEventListener('toggle', handleToggle);

		return () => {
			modal?.removeEventListener('toggle', handleToggle);
		};
	});
</script>

<DashboardModal bind:modal title="Prüfungen">
	<div class="sticky -top-4 z-10 -mt-4 flex justify-center bg-base-100 pt-4 pb-2">
		<div role="tablist" class="tabs-border tabs-box tabs p-0">
			<button
				role="tab"
				class="tab {signupOrVerfahren === SignupOrVerfahren.signup ? 'tab-active' : ''}"
				onclick={() => {
					signupOrVerfahren = SignupOrVerfahren.signup;
				}}
			>
				Anmeldung
			</button>
			<button
				role="tab"
				class="tab {signupOrVerfahren === SignupOrVerfahren.verfahren ? 'tab-active' : ''}"
				onclick={() => {
					signupOrVerfahren = SignupOrVerfahren.verfahren;
				}}
			>
				Abmeldung
			</button>
		</div>
	</div>

	{#if signupOrVerfahren === SignupOrVerfahren.signup && signupOptions}
		<ExamSignupAccordion data={signupOptions} {signupOrVerfahren} {onExamSignupOrCancel} />
	{:else if verfahrenOptions}
		<ExamSignupAccordion data={verfahrenOptions} {signupOrVerfahren} {onExamSignupOrCancel} />
	{:else}
		<div>Lädt...</div>
	{/if}
</DashboardModal>
