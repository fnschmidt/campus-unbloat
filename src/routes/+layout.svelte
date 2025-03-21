<script lang="ts">
	import '../app.postcss';

	import type { SvelteComponent } from 'svelte';
	import {
		AppShell,
		AppBar,
		getDrawerStore,
		type PopupSettings,
		storePopup,
		popup,
		initializeStores,
		Modal,
		Toast,
		Drawer
	} from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import iosPWASplash from 'ios-pwa-splash';
	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';

	// cookieconsent (short name to avoid content blockers)
	import { load_cc } from '$lib/CC/cc';
	import OsterEi from '$lib/osterEi.svelte';
	import '$lib/fonts/css/all.min.css';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	const drawerStore = getDrawerStore();
	load_cc();
	const popupRechtliches: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupRechtliches',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};
	const popupProjectInfo: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupProjectInfo',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};

	if (
		browser &&
		/iPhone/i.test(navigator.userAgent) &&
		!window.matchMedia('(display-mode: standalone)').matches
	) {
		iosPWASplash('/splash-icon.png', '#e0e0e0');
		// check if reload necessary on foreground state (delta >1hour)
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible') {
				check_needs_reload();
			}
		});
	}

	function formatDate(abapdate: string) {
		const year = abapdate.slice(0, 4);
		const month = abapdate.slice(4, 6);
		const day = abapdate.slice(6, 8);

		return `${day}.${month}.${year}`;
	}

	const reloadInterval = 60 * 60 * 1000; // 1 hour in milliseconds
	const start = Date.now();
	function check_needs_reload() {
		const now = Date.now();
		const diff = now - start;
		if (diff > reloadInterval) {
			location.reload();
		}
	}

	let osterEi: SvelteComponent;
</script>

<div
	class="card z-50 p-3 w-72 shadow-xl variant-glass-secondary border-token border-secondary-500 fixed"
	data-popup="popupRechtliches"
>
	<div class="flex space-x-2">
		<a
			href="/impressum"
			class="flex-grow btn btn-sm bg-surface-50-900-token border-2 border-secondary-500"
			>Impressum</a
		>
		<a
			href="/datenschutz"
			class="flex-grow btn btn-sm bg-surface-50-900-token border-2 border-secondary-500"
			>Datenschutz</a
		>
	</div>
</div>

<div
	class="card z-50 p-3 shadow-xl variant-glass-secondary border-token border-secondary-500 fixed"
	data-popup="popupProjectInfo"
>
	<div class="flex space-x-2">
		<a
			href="https://github.com/greybaron/campus-unbloat"
			target="_blank"
			class="flex-grow btn btn-sm bg-surface-50-900-token border-2 border-secondary-500"
			><i class="fa-brands fa-github"></i>
			<p>Quellcode</p></a
		>
		<a
			href="https://github.com/greybaron/campus-unbloat/issues/new?assignees=greybaron&labels=triage&title=[Feature]:%20/[Bug]:%20...&body=Describe%20a%20bug%20you%20encountered,%20or%20a%20feature%20that%20you%20think%20is%20missing."
			target="_blank"
			class="flex-grow btn btn-sm bg-surface-50-900-token border-2 border-primary-400-500-token"
			><i class="fa-solid fa-bug"></i>
			<p>Fehler melden</p></a
		>
	</div>
</div>

<OsterEi bind:this={osterEi} />
<Toast buttonDismiss="btn-icon btn-icon-sm variant-filled transition-none" />
<Drawer
	on:drawer={() => drawerStore.close()}
	position="right"
	width="min-w-0 ml-12"
	bgDrawer="variant-glass-primary bg-red-200/30"
	bgBackdrop=""
	regionDrawer="p-8"
>
	<div class="flex flex-col justify-center h-full space-y-4">
		{#if $drawerStore.meta.reminders}
			{#if $drawerStore.meta.reminders.latest.length > 0}
				<div>
					<h3 class="h3 font-bold">Letze Prüfungsergebnisse</h3>

					<ul class="list-disc list-inside text-lg">
						{#each $drawerStore.meta.reminders.latest as item}
							<li>
								<strong>{formatDate(item.agrdate)}</strong>: {item.awobject} ({item.awobject_short})
								-
								<strong>{item.gradesymbol}</strong>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if $drawerStore.meta.reminders.upcoming.length > 0}
				<div>
					<h3 class="h3 font-bold">Anstehende Prüfungen</h3>
					<ul class="list-disc list-inside text-lg">
						{#each $drawerStore.meta.reminders.upcoming as item}
							<li>
								<strong>{formatDate(item.evdat)}</strong>: {item.sm_stext}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if $drawerStore.meta.reminders.exams > 0}
				<h3 class="h3 font-bold">Sie können sich für Prüfungsverfahren anmelden</h3>
			{/if}

			{#if $drawerStore.meta.reminders.electives > 0 && $drawerStore.meta.reminders.semester <= 6}
				<strong>
					<p>
						Anmeldung für Wahlpflichtmodule im {$drawerStore.meta.reminders.semester}. Fachsemester
					</p>
				</strong>
			{/if}
		{/if}
	</div>
</Drawer>
<Modal />

<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<strong on:click={() => osterEi.runOsterEi()} class="text-lg sm:text-xl"
					>CampusUnbloat</strong
				>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div class="flex items-center justify-end space-x-1">
					<button
						use:popup={popupProjectInfo}
						class="size-6 btn-icon variant-ghost-secondary text-xs"
					>
						<i class="fa-solid fa-info"></i>
					</button>
					<button
						use:popup={popupRechtliches}
						class="h-6 btn btn-sm variant-ghost-secondary text-xs"
					>
						<p>Rechtliches</p>
					</button>

					{#if $page.url.pathname == '/impressum' || $page.url.pathname == '/datenschutz'}
						<button
							on:click={async () => {
								const response = await fetch('/');

								if (response.redirected) {
									if (response.url.endsWith('/dashboard')) {
										goto('/dashboard');
									} else {
										// should never happen
										window.location.href = response.url;
									}
								} else {
									goto('/');
								}
							}}
							class="h-6 btn btn-sm variant-ghost-secondary text-xs"
						>
							<p>Zurück</p>
						</button>
					{/if}

					{#if $page.url.pathname == '/dashboard'}
						<button
							aria-label="Abmelden"
							on:click={async () => {
								await fetch('/logout', {
									method: 'POST'
								});
								goto('/');
							}}
							class="h-6 btn btn-sm variant-ghost-primary"
						>
							<i class="fa-solid fa-right-from-bracket"></i>
						</button>
					{/if}
					{#if $page.url.pathname == '/'}
						<a
							href="https://github.com/greybaron/campus-unbloat"
							target="_blank"
							aria-label="Quellcode (GitHub)"
							class="h-6 btn btn-sm text-xs variant-ghost"
						>
							GitHub
							<i class="ml-1 fa-brands fa-github"></i>
						</a>
					{/if}
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>
