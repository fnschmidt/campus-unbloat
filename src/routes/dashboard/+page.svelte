<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Portal from 'svelte-portal';

	import {
		// getToastSettings,
		ToastPayloadClass,
		type BasicUserData,
		type CdReminders,
		type ToastPayload
	} from '$lib/types';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import { components, validateComponentOrder } from '$lib/TSHelpers/ComponentOrder.js';

	import PageContainer from '$lib/PageContainer.svelte';
	import BasicInfoTile from '$lib/TilesAndModals/BasicInfoTile.svelte';
	import CalendarTile from '$lib/TilesAndModals/CalendarTile.svelte';
	import ExamSignupTile from '$lib/TilesAndModals/ExamSignupTile.svelte';
	import GradesTile from '$lib/TilesAndModals/GradesTile.svelte';
	import MensaTile from '$lib/TilesAndModals/MensaTile.svelte';
	import BlockplanTile from '$lib/TilesAndModals/BlockplanTile.svelte';
	import { every as _every, some as _some, isEqual as _isEqual } from 'lodash-es';
	import DashReorderModal from '$lib/TilesAndModals/DashReorderModal.svelte';
	import NotificationDrawer from '$lib/components/page/NotificationDrawer.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faBell } from '@fortawesome/free-solid-svg-icons';

	export let data;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const componentMap: Record<string, Component<any, any, any>> = {
		BasicInfoTile,
		GradesTile,
		CalendarTile,
		MensaTile,
		ExamSignupTile,
		BlockplanTile
	};

	let basicUserData: BasicUserData = JSON.parse(data.user_basic!);

	let componentOrder: Writable<string[]>;
	let componentProps: Record<string, object>;

	let reminders: CdReminders | null;
	let presentReminderCategories: number = 0;

	function showToast(data: ToastPayload | CustomEvent) {
		let payload: ToastPayload;

		if (data instanceof CustomEvent) {
			payload = data.detail;
		} else {
			payload = data;
		}

		window.alert(`${payload.class}: ${payload.text}`);
		// const toastSettings = getToastSettings(payload);
		// toastStore.trigger(toastSettings);
	}

	let readRemindersStore: Writable<CdReminders>;

	onMount(async () => {
		componentOrder = persistentStore('compOrder', components);
		if (!validateComponentOrder($componentOrder)) {
			console.error('Component order is fucked, resetting');
			componentOrder.set(components);
		}

		componentProps = {
			BasicInfoTile: { basicUserData }
		};

		fetchReminders();
	});

	async function fetchReminders() {
		reminders = null;
		presentReminderCategories = 0;

		const res = await fetch('/api/reminders');

		if (!res.ok) {
			let error = await res.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			showToast(payload);
		} else {
			reminders = await res.json();
			presentReminderCategories = getUnreadReminderCategories(reminders!);
		}
	}

	function openRemindersDrawer() {
		const toggle: HTMLElement | null = document.getElementById('notifications-drawer');
		if (toggle && toggle instanceof HTMLInputElement) toggle.checked = true;

		readRemindersStore.set(reminders!);
		presentReminderCategories = getUnreadReminderCategories(reminders!);
	}

	function getUnreadReminderCategories(reminders: CdReminders): number {
		const blankCdReminders: CdReminders = {
			latest: [],
			upcoming: [],
			exams: 0,
			electives: 0,
			semester: 0
		};

		readRemindersStore = persistentStore('readReminders', blankCdReminders);
		const readReminders = $readRemindersStore;

		let presentReminderCategories = 0;

		if (!allItemsPresentInSecondDeep(reminders.latest, readReminders.latest))
			presentReminderCategories++;
		if (!allItemsPresentInSecondDeep(reminders.upcoming, readReminders.upcoming))
			presentReminderCategories++;
		if (reminders.exams > 0 && reminders.exams != readReminders.exams) presentReminderCategories++;
		if (
			reminders.semester <= 6 &&
			reminders.electives != 0 &&
			reminders.electives != readReminders.electives
		) {
			presentReminderCategories++;
		}

		return presentReminderCategories;
	}

	function allItemsPresentInSecondDeep(list1: object[], list2: object[]): boolean {
		return _every(list1, (item) => _some(list2, (item2) => _isEqual(item, item2)));
	}
</script>

<NotificationDrawer {reminders} />

<PageContainer>
	{#if basicUserData}
		<div class="mx-auto flex w-[94%] items-center space-x-1 sm:w-96 lg:w-[48.6rem]">
			<h1 class="grow text-3xl font-bold">
				Hallo, {basicUserData.first_name}.
			</h1>

			<DashReorderModal {componentOrder} />

			<div class="indicator">
				<span
					class="indicator-item badge size-6 rounded-full badge-primary {presentReminderCategories
						? ''
						: 'hidden'}">{presentReminderCategories}</span
				>

				<button
					onclick={() => openRemindersDrawer()}
					aria-controls="notifications-drawer"
					disabled={!reminders}
					aria-label="Benachrichtigungen"
					class="drawer-button btn btn-circle {reminders ? 'btn-accent' : 'btn-soft'}"
				>
					{#if reminders}
						<FontAwesomeIcon icon={faBell} />
					{:else}
						<span class="loading loading-md loading-spinner"></span>
					{/if}
				</button>
			</div>
		</div>
	{/if}
	{#if $componentOrder && componentProps}
		<div class="mx-auto grid w-[98%] grid-cols-1 gap-3 sm:w-auto lg:grid-cols-2">
			<!-- create portals -->
			{#each components as _, idx (idx)}
				<span class="contents" id="portal{idx}"></span>
			{/each}

			<!-- create tiles -->
			{#each components as component (component)}
				<Portal target="#portal{$componentOrder.indexOf(component)}">
					<svelte:component
						this={componentMap[component]}
						{...componentProps[component]}
						on:showToast={showToast}
						on:updateReminders={fetchReminders}
					/>
				</Portal>
			{/each}
		</div>
	{/if}
</PageContainer>
