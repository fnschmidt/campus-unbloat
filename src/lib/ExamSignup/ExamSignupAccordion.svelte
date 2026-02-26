<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faBan,
		faCalendar,
		faCircleInfo,
		faClock,
		faInfoCircle,
		faLocationDot,
		faPen,
		faQuestion
	} from '@fortawesome/free-solid-svg-icons';

	import {
		SignupOrVerfahren,
		ToastPayloadClass,
		type CampusDualSignupOption,
		type CampusDualVerfahrenOption,
		type CampusExamMetadata,
		type ToastPayload
	} from '$lib/types';

	let {
		data,
		signupOrVerfahren,
		onExamSignupOrCancel = () => {},
		onGetExamInfo = () => {}
	}: {
		data?: Array<CampusDualSignupOption | CampusDualVerfahrenOption>;
		signupOrVerfahren: SignupOrVerfahren;
		onExamSignupOrCancel?: () => void;
		onGetExamInfo?: (internal_metadata: CampusExamMetadata) => void;
	} = $props();

	const dispatch = createEventDispatcher();

	function getStatusMeta(status: string | undefined) {
		switch (status) {
			case '📝':
				return {
					icon: faPen,
					badge: 'badge-primary'
				};
			case '🚫':
				return {
					icon: faBan,
					badge: 'badge-error'
				};
			default:
				return {
					icon: faQuestion,
					badge: 'badge-neutral'
				};
		}
	}

	async function startExamSignup(internal_metadata?: CampusDualSignupOption['internal_metadata']) {
		data = undefined;

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

{#if data !== undefined}
	<div class="space-y-2">
		{#each data as option (option)}
			{@const statusMeta = getStatusMeta(option.status)}
			<div class="collapse-arrow collapse bg-base-200">
				<input type="checkbox" checked />
				<div class="collapse-title flex items-center gap-3">
					<span class="badge size-7 {statusMeta.badge}">
						<FontAwesomeIcon icon={statusMeta.icon} />
					</span>
					<div>
						<div class="font-medium">{option.name}</div>
						<div class="text-sm opacity-60">{option.verfahren} · {option.pruefart}</div>
					</div>
				</div>
				<div class="collapse-content space-y-4">
					<div class="card bg-base-100 shadow">
						<div class="card-body gap-3 p-4">
							{#if option.exam_date}
								<div class="flex items-center gap-3">
									<span class="badge size-7 badge-primary">
										<FontAwesomeIcon icon={faCalendar} />
									</span>
									<div>
										<div class="font-bold">
											{option.exam_date}{option.exam_time ? `, ${option.exam_time}` : ''}
										</div>
										<div class="text-sm opacity-60">Prüfungsdatum</div>
									</div>
								</div>
							{/if}

							{#if option.exam_time}
								<div class="flex items-center gap-3">
									<span class="badge size-7 badge-primary">
										<FontAwesomeIcon icon={faClock} />
									</span>
									<div>
										<div class="font-bold">{option.exam_time}</div>
										<div class="text-sm opacity-60">Prüfungszeit</div>
									</div>
								</div>
							{/if}

							{#if option.exam_room}
								<div class="flex items-center gap-3">
									<span class="badge size-7 badge-primary">
										<FontAwesomeIcon icon={faLocationDot} />
									</span>
									<div class="font-bold">{option.exam_room}</div>
								</div>
							{/if}
						</div>
					</div>

					<div class="card bg-base-100 shadow">
						<div class="card-body gap-3 p-4">
							{#if option.signup_information}
								<div class="flex items-center gap-3">
									<span class="badge size-7 badge-primary">
										<FontAwesomeIcon icon={faCircleInfo} />
									</span>
									<div class="font-bold">{option.signup_information}</div>
								</div>
							{/if}

							{#if option.warning_message}
								<div class="flex items-center gap-3">
									<span class="badge size-7 badge-primary">
										<FontAwesomeIcon icon={faInfoCircle} />
									</span>
									<div class="font-bold">{option.warning_message}</div>
								</div>
							{/if}
						</div>
					</div>

					{#if option.internal_metadata}
						<div class="flex justify-center gap-2">
							<button
								onclick={() => onGetExamInfo(option.internal_metadata!)}
								class="btn btn-square btn-primary"
							>
								<FontAwesomeIcon icon={faInfoCircle} />
							</button>
							<button
								class="btn {signupOrVerfahren === SignupOrVerfahren.signup
									? 'btn-success'
									: 'btn-error'}"
								onclick={() => startExamSignup(option.internal_metadata)}
							>
								{signupOrVerfahren === SignupOrVerfahren.signup
									? 'Zur Prüfung anmelden'
									: 'Von Prüfung abmelden'}
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="flex h-56 flex-col items-center justify-center">
		<span class="loading loading-xl loading-dots"></span>
	</div>
{/if}
