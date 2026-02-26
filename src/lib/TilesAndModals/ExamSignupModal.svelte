<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import {
		SignupOrVerfahren,
		ToastPayloadClass,
		type CampusDualSignupOption,
		type CampusDualVerfahrenOption,
		type CampusExamDetails,
		type CampusExamMetadata,
		type ToastPayload
	} from '$lib/types';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import ExamSignupAccordion from '$lib/ExamSignup/ExamSignupAccordion.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faXmark } from '@fortawesome/free-solid-svg-icons';

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

	let examDetailsModal: HTMLDialogElement | null = null;
	let examDetails: CampusExamDetails | null = $state(null);

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

	async function showexamDetailsModal(internal_metadata: CampusExamMetadata) {
		getExamDetails(internal_metadata);
		examDetailsModal?.showModal();
	}

	async function getExamDetails(internal_metadata?: CampusExamMetadata) {
		examDetails = null;
		const response = await fetch('/api/examdetails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(internal_metadata)
		});

		if (!response.ok) {
			window.alert(await response.text());
			// const toastSettings = getToastSettings({
			// 	text: await response.text(),
			// 	class: ToastPayloadClass.error
			// });
			// toastStore.trigger(toastSettings);
			return;
		} else {
			examDetails = await response.json();
		}
	}
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
		<ExamSignupAccordion
			data={signupOptions}
			{signupOrVerfahren}
			{onExamSignupOrCancel}
			onGetExamInfo={showexamDetailsModal}
		/>
	{:else if verfahrenOptions}
		<ExamSignupAccordion
			data={verfahrenOptions}
			{signupOrVerfahren}
			{onExamSignupOrCancel}
			onGetExamInfo={showexamDetailsModal}
		/>
	{:else}
		<div>Lädt...</div>
	{/if}
</DashboardModal>

<dialog class="modal" bind:this={examDetailsModal}>
	<div class="modal-box max-w-2xl">
		{#if examDetails}
			<form method="dialog" class="flex items-center justify-between">
				<h4 class="text-center text-lg font-semibold">jimbob</h4>
				<button class="btn btn-circle"><FontAwesomeIcon icon={faXmark} /></button>
			</form>

			<!-- hier content -->
		{:else}
			<span class="loading loading-xl loading-dots"></span>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop"><button>close</button></form>
</dialog>
