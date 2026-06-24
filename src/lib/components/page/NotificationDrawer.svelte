<script lang="ts">
	import type { CdReminders } from '$lib/types';

	let { reminders }: { reminders: CdReminders | null } = $props();

	function formatDate(abapdate: string) {
		const year = abapdate.slice(0, 4);
		const month = abapdate.slice(4, 6);
		const day = abapdate.slice(6, 8);

		return `${day}.${month}.${year}`;
	}
</script>

<div class="drawer z-50 drawer-end">
	<input id="notifications-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label for="notifications-drawer" aria-label="close sidebar" class="drawer-overlay opacity-0"
		></label>
		<label
			for="notifications-drawer"
			class="win-w-0 ml-12 flex h-full flex-col justify-center rounded-l-2xl p-8 shadow-2xl backdrop-blur-2xl"
		>
			<ul class="overflow-y-auto">
				<div class="space-y-4">
					{#if reminders}
						{#if reminders.latest.length > 0}
							<div>
								<h3 class="h3 font-bold">Letzte Prüfungsergebnisse</h3>

								<ul class="list-inside list-disc text-lg">
									{#each reminders.latest as item (item)}
										<li>
											<strong>{formatDate(item.agrdate)}</strong>: {item.awobject} ({item.awobject_short})
											-
											<strong>{item.gradesymbol}</strong>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						{#if reminders.upcoming.length > 0}
							<div>
								<h3 class="h3 font-bold">Anstehende Prüfungen</h3>
								<ul class="list-inside list-disc text-lg">
									{#each reminders.upcoming as item (item)}
										<li>
											<strong>{formatDate(item.evdat)}</strong>: {item.sm_stext}
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						{#if reminders.exams > 0}
							<h3 class="h3 font-bold">Sie können sich für Prüfungsverfahren anmelden</h3>
						{/if}

						{#if reminders.electives > 0 && reminders.semester <= 6}
							<strong>
								<p>
									Anmeldung für Wahlpflichtmodule im {reminders.semester}. Fachsemester
								</p>
							</strong>
						{/if}
					{/if}
				</div>
			</ul>
		</label>
	</div>
</div>
