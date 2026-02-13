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

				<div class="rounded-box bg-base-200 p-3">
					<label class="label cursor-pointer items-start justify-start gap-3">
						<input
							type="checkbox"
							name="dataConsent"
							required
							class="checkbox mt-1 checkbox-primary"
						/>
						<span class="label-text">
							Ich stimme zu, dass sich <span
								class="bg-linear-to-br from-blue-700 to-pink-600 box-decoration-clone bg-clip-text text-transparent"
								>CampusUnbloat</span
							>
							in meinem Namen bei CampusDual einloggt.
							<span class="block text-xs opacity-70">Daten werden nur lokal gespeichert.</span>
						</span>
					</label>

					<div class="mt-2 flex justify-between text-sm">
						<a class="link link-hover" href={resolve('/impressum')}>Impressum</a>
						<a class="link link-hover" href={resolve('/datenschutz')}>Datenschutz</a>
					</div>
				</div>

				<div class="pt-2">
					<button
						type="submit"
						class="btn w-full btn-primary"
						class:loading={loginInProgress}
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
