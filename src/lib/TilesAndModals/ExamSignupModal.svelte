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
	import {
		faCalendar,
		faCircleInfo,
		faRecycle,
		faUserTie,
		faXmark
	} from '@fortawesome/free-solid-svg-icons';

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
			<form method="dialog" class="mb-3 flex items-center justify-between">
				<h4 class="text-center text-lg font-semibold">{examDetails.ev_stext}</h4>
				<button class="btn btn-circle"><FontAwesomeIcon icon={faXmark} /></button>
			</form>

			<div class="card-body flex flex-col gap-3 p-0">
				{#if examDetails.ev_examorg_longtext || examDetails.ev_examorg_text}
					<div class="flex items-center gap-3">
						<span class="badge size-7 badge-soft badge-primary">
							<FontAwesomeIcon icon={faCircleInfo} />
						</span>
						<div>
							<div class="font-bold">
								{examDetails.ev_examorg_longtext
									? examDetails.ev_examorg_longtext
									: examDetails.ev_examorg_text}
							</div>
							<div class="text-sm opacity-60">Prüfungsart</div>
						</div>
					</div>
				{/if}
				{#if examDetails.ev_reason}
					<div class="flex items-center gap-3">
						<span class="badge size-7 badge-soft badge-primary">
							<FontAwesomeIcon icon={faRecycle} />
						</span>
						<div>
							<div class="font-bold">{examDetails.ev_reason}</div>
							<div class="text-sm opacity-60">Versuch</div>
						</div>
					</div>
				{/if}
				{#if examDetails.ev_examdate}
					<div class="flex items-center gap-3">
						<span class="badge size-7 badge-soft badge-primary">
							<FontAwesomeIcon icon={faCalendar} />
						</span>
						<div>
							<div class="font-bold">
								{examDetails.ev_examdate.split('-').reverse().join('.')} ({examDetails.ev_exambegtime.slice(
									0,
									5
								)}-{examDetails.ev_examendtime.slice(0, 5)})
							</div>
							<div class="text-sm opacity-60">Prüfungstermin</div>
						</div>
					</div>
				{/if}
				{#if examDetails.ev_instructor}
					<div class="flex items-center gap-3">
						<span class="badge size-7 badge-soft badge-primary">
							<FontAwesomeIcon icon={faUserTie} />
						</span>
						<div>
							<div class="font-bold">{examDetails.ev_instructor}</div>
							<div class="text-sm opacity-60">Prüfer*in</div>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="flex h-48 items-center justify-center">
				<span class="loading loading-xl loading-dots"></span>
			</div>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop"><button>close</button></form>
</dialog>
