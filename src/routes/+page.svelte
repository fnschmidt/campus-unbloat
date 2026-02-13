<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	import type { ActionData } from './$types';

	// Svelte 5 (runes): `form` is derived from the server response, but can be temporarily overridden
	let { form: serverForm = null } = $props<{ form?: ActionData | null }>();

	let form = $derived(serverForm);
	let loginInProgress = $state(false);
</script>

<div class="flex h-full w-full items-center justify-center p-4">
	<div class="card w-full max-w-md bg-base-200 shadow-xl">
		<div class="card-body gap-4">
			<div class="space-y-1 text-center">
				<h1 class="text-2xl font-semibold">Anmelden</h1>
			</div>

			{#if form?.message}
				<div role="alert" class="alert alert-error">
					<span>{form.message}</span>
				</div>
			{/if}

			<form
				action="?/login"
				method="POST"
				class="space-y-3"
				use:enhance={() => {
					// Clear the previous response (e.g. bad credentials) and show a loading state.
					form = null;
					loginInProgress = true;

					return async ({ update }) => {
						await update();
						loginInProgress = false;
					};
				}}
			>
				<div class="form-control">
					<label class="label" for="username">
						<span class="label-text">CampusDual-Benutzername</span>
					</label>
					<input
						id="username"
						name="username"
						type="text"
						autocomplete="username"
						required
						placeholder="500xxxx"
						class="input-bordered input w-full"
					/>
				</div>

				<div class="form-control">
					<label class="label" for="password">
						<span class="label-text">CampusDual-Passwort</span>
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="input-bordered input w-full"
					/>
				</div>

				<div class=" space-y-2 rounded-2xl bg-base-100 p-3 shadow-lg">
					<label class="label w-full cursor-pointer items-start justify-start gap-3">
						<input
							type="checkbox"
							name="dataConsent"
							required
							class="checkbox mt-1 shrink-0 checkbox-primary"
						/>
						<span class="label-text flex-1 leading-snug whitespace-normal">
							Ich stimme zu, dass sich
							<span
								class="bg-linear-to-br from-primary to-accent box-decoration-clone bg-clip-text text-transparent"
								>CampusUnbloat</span
							>
							in meinem Namen bei CampusDual einloggt.
							<span class="block text-xs opacity-70">Daten werden nur lokal gespeichert.</span>
						</span>
					</label>

					<div class="mt-2 flex justify-end space-x-2">
						<a class="btn btn-soft btn-sm btn-primary" href={resolve('/impressum')}>Impressum</a>
						<a class="btn btn-soft btn-sm btn-primary" href={resolve('/datenschutz')}>Datenschutz</a
						>
					</div>
				</div>

				<div class="pt-2">
					<button
						type="submit"
						class="btn w-full btn-primary"
						disabled={loginInProgress}
						aria-busy={loginInProgress}
					>
						Anmelden
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
