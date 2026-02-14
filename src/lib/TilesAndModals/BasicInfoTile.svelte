<script lang="ts">
	// import { ProgressBar } from '@skeletonlabs/skeleton';
	import { onMount, createEventDispatcher } from 'svelte';

	import DashboardTile from '$lib/DashboardTile.svelte';
	import { ToastPayloadClass, type BasicUserData, type ToastPayload } from '$lib/types';

	export let basicUserData: BasicUserData;

	const dispatch = createEventDispatcher();

	let fachsemester: string;
	let ects: string;

	onMount(async () => {
		const res1 = await fetch('/api/getects');

		if (res1.ok) {
			ects = await res1.json();
		} else {
			let error = await res1.text();

			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			dispatch('showToast', payload);
		}

		const res2 = await fetch('/api/getfachsem');

		if (res2.ok) {
			fachsemester = await res2.text();
		} else {
			let error = await res2.text();

			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			dispatch('showToast', payload);
		}
	});
</script>

<DashboardTile
	title="Deine Infos"
	clickable={false}
	ready={Boolean(basicUserData && fachsemester != undefined && ects != undefined)}
>
	<div class="flex h-full max-h-44 min-h-32 w-full flex-col justify-between space-y-2">
		<div class="grow"></div>
		{#if basicUserData}
			{#if basicUserData.seminar_group}
				<p>{basicUserData.user} - {basicUserData.seminar_group}</p>
				<p>{basicUserData.seminar_name}</p>
			{:else}
				<p>{basicUserData.user}</p>
				<div class="m-4 flex items-center space-x-2">
					<i class="fa-solid fa-info-circle"></i>
					<p class="text-sm">
						Anscheinend hast du keine Seminargruppe. Das ist normal wenn das Studium vorbei ist
					</p>
				</div>
			{/if}
		{/if}
		<div class="grow"></div>
		{#if fachsemester != undefined && ects != undefined}
			<div class="flex space-x-2">
				<div class="card flex w-full flex-col justify-center space-y-2 bg-base-200/80 p-2">
					<small id="fachsem">Fachsemester: {fachsemester}</small>
					<progress class="progress progress-primary" value={parseInt(fachsemester)} max={6}
					></progress>
					<!-- <ProgressBar
						meter="bg-secondary-500"
						track="bg-secondary-500/30"
						labelledby="fachsem"
						value={parseInt(fachsemester)}
						max={6}
					/> -->
				</div>
				<div class="card flex w-full flex-col justify-center space-y-2 bg-base-200/80 p-2">
					<small id="ects">ECTS: {ects} / 180</small>
					<progress class="progress progress-error" value={parseInt(ects)} max={180}></progress>

					<!-- <ProgressBar
						meter="bg-primary-500"
						track="bg-primary-500/30"
						labelledby="ects"
						value={parseInt(ects)}
						max={180}
					/> -->
				</div>
			</div>
		{/if}
	</div>
</DashboardTile>
