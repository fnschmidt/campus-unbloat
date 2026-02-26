<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import {
		SignupOrVerfahren,
		ToastPayloadClass,
		type CampusDualSignupOption,
		type CampusDualVerfahrenOption,
		type ToastPayload
	} from '$lib/types';

	let {
		data = [],
		signupOrVerfahren,
		onExamSignupOrCancel = () => {}
	}: {
		data?: Array<CampusDualSignupOption | CampusDualVerfahrenOption>;
		signupOrVerfahren: SignupOrVerfahren;
		onExamSignupOrCancel?: () => void;
	} = $props();

	const dispatch = createEventDispatcher();

	async function startExamSignup(internal_metadata?: CampusDualSignupOption['internal_metadata']) {
		const url =
			signupOrVerfahren === SignupOrVerfahren.signup ? '/api/registerexam' : '/api/cancelexam';

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(internal_metadata)
		});

		let payload: ToastPayload;

		if (!response.ok) {
			payload = {
				text: await response.text(),
				class: ToastPayloadClass.error
			};
		} else {
			const respText = await response.text();
			if (respText === '{}') {
				payload = {
					text:
						signupOrVerfahren === SignupOrVerfahren.signup
							? 'Erfolgreich angemeldet'
							: 'Erfolgreich abgemeldet',
					class: ToastPayloadClass.success
				};
			} else {
				payload = {
					text: respText,
					class: ToastPayloadClass.error
				};
			}
		}

		dispatch('showToast', payload);
		onExamSignupOrCancel();
	}
</script>

{#if data.length > 0}
	<div class="space-y-2">
		{#each data as option (option)}
			<div class="collapse-arrow collapse">
				<input type="checkbox" checked />
				<div class="collapse-title">{option.name}</div>
				<div class="collapse-content">
					<p>{option.signup_information}</p>
					{#if option.exam_date}
						<p>{option.exam_date}</p>
					{/if}
					{#if option.exam_time}
						<p>{option.exam_time}</p>
					{/if}
					{#if option.exam_room}
						<p>{option.exam_room}</p>
					{/if}
					{#if option.internal_metadata}
						<button
							class="btn btn-primary"
							onclick={() => startExamSignup(option.internal_metadata)}
						>
							{signupOrVerfahren === SignupOrVerfahren.signup
								? 'Zur Prüfung anmelden'
								: 'Von Prüfung abmelden'}
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div>Keine Prüfungen gefunden.</div>
{/if}
