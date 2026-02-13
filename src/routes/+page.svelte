<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	import type { ActionData } from './$types';

	export let form: ActionData;

	let login_in_progress = false;
</script>

<div class="flex h-full items-center justify-center">
	<div class="w-full max-w-sm">
		<form
			use:enhance={() => {
				// clear the previous response if any (to remove bad credentials msg)
				form = null;
				login_in_progress = true;

				return async ({ update }) => {
					await update();
					login_in_progress = false;
				};
			}}
			action="?/login"
			method="POST"
			class="bg-surface-100-800-token rounded-token space-y-4 p-6 pb-4 shadow-md dark:bg-gray-800"
		>
			<div>
				<label class="text-token mb-2 block text-sm font-bold" for="username">
					CampusDual-Benutzername
				</label>
				<input
					class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
					name="username"
					id="username"
					type="text"
					autocomplete="username"
					required
					placeholder="500xxxx"
				/>
			</div>
			<div>
				<label class="text-token mb-2 block text-sm font-bold" for="password"
					>CampusDual-Passwort</label
				>
				<input
					class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-600 shadow focus:outline-none"
					name="password"
					id="password"
					type="password"
					autocomplete="current-password"
					required
					placeholder="das normale, nicht den Hash"
				/>
				<div class="-mb-3 h-6">
					{#if form?.message}
						<small class="text-red-500">{form.message}</small>
					{/if}
				</div>
			</div>

			<div
				class="bg-surface-200-700-token border-token border-surface-500-400-token space-y-2 rounded-md p-2"
			>
				<label class="flex items-center space-x-2">
					<input
						type="checkbox"
						class="variant-outline-surface checkbox outline-2"
						name="dataConsent"
						required
					/>
					<p class="text-sm font-bold">
						Ich stimme zu, dass
						<span
							class="bg-linear-to-br from-blue-700 to-pink-600 box-decoration-clone bg-clip-text text-transparent"
							>CampusUnbloat</span
						>
						sich in meinem Namen bei CampusDual einloggt.
						<br />
						Daten werden nur lokal gespeichert.
					</p>
				</label>

				<div class="flex justify-center space-x-2">
					<a
						href={resolve('/impressum')}
						type="button"
						class="variant-filled btn h-7 text-sm transition-transform">Impressum</a
					>
					<a
						href={resolve('/datenschutz')}
						type="button"
						class="variant-filled btn h-7 text-sm transition-transform">Datenschutzerklärung</a
					>
				</div>
			</div>

			<div class="mt-4 flex justify-center">
				<button
					class="{login_in_progress
						? 'variant-ghost-primary pointer-events-none'
						: 'variant-filled-primary'} btn w-32"
				>
					Anmelden
				</button>
			</div>
		</form>
	</div>
</div>
