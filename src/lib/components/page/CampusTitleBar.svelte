<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faBug, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>

<!-- Obere Navigationsleiste; Padding oben respektiert Safe-Area-Inset für nicht-eckige Bildschirme -->
<nav
	class="sticky top-0 z-50 flex h-14 items-center justify-between
	border-b border-b-base-300 bg-base-200 px-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-4 select-none"
>
	<!-- <div class="w-24 dark:brightness-90 dark:invert dark:saturate-0">
		<Logo />
	</div> -->
	<p class="text-xl font-bold">CampusUnbloat</p>
	<div class="flex flex-row space-x-1">
		<div class="dropdown dropdown-center">
			<div tabindex="0" role="button" class="btn my-1 btn-circle btn-soft btn-sm btn-primary">
				<p class="font-mono text-[14px]">i</p>
			</div>
			<div
				tabindex="-1"
				class="dropdown-content card z-1 w-48 rounded-3xl bg-primary/20 shadow-md backdrop-blur-2xl card-sm"
			>
				<div class="card-body p-3">
					<a
						href="https://github.com/fnschmidt/campus-unbloat"
						target="_blank"
						aria-label="Quellcode (GitHub)"
						class="btn rounded-full btn-outline btn-primary"
					>
						<!-- <Github size={18} /> -->
						<FontAwesomeIcon icon={faGithub} />
						Quellcode</a
					>
					<a
						href="https://github.com/fnschmidt/campus-unbloat/issues/new?assignees=fnschmidt&labels=triage&title=[Feature]:%20/[Bug]:%20...&body=Describe%20a%20bug%20you%20encountered,%20or%20a%20feature%20that%20you%20think%20is%20missing."
						target="_blank"
						class="btn rounded-full btn-outline btn-primary"
						><FontAwesomeIcon icon={faBug} /> Fehler melden</a
					>
				</div>
			</div>
		</div>

		<div class="dropdown dropdown-center">
			<div tabindex="0" role="button" class="btn my-1 rounded-full btn-soft btn-sm btn-primary">
				Rechtliches
			</div>
			<div
				tabindex="-1"
				class="dropdown-content card z-1 w-44 rounded-3xl bg-primary/20 shadow-md backdrop-blur-2xl card-sm"
			>
				<div class="card-body p-3">
					<a href={resolve('/impressum')} class="btn rounded-full btn-outline btn-primary"
						>Impressum</a
					>
					<a href={resolve('/datenschutz')} class="btn rounded-full btn-outline btn-primary"
						>Datenschutz</a
					>
				</div>
			</div>
		</div>

		{#if page.route.id == '/impressum' || page.route.id == '/datenschutz'}
			<button
				class="btn my-1 rounded-full btn-soft btn-sm btn-accent"
				onclick={async () => {
					const response = await fetch('/');

					if (response.redirected) {
						if (response.url.endsWith('/dashboard')) {
							goto(resolve('/dashboard'));
						} else {
							// should never happen
							window.location.href = response.url;
						}
					} else {
						goto(resolve('/'));
					}
				}}
			>
				Zurück
			</button>
		{/if}
		{#if page.route.id == '/dashboard'}
			<button
				class="btn my-1 rounded-full btn-soft btn-sm btn-accent"
				aria-label="Abmelden"
				onclick={async () => {
					await fetch('/logout', {
						method: 'POST'
					});
					goto(resolve('/'));
				}}
			>
				<!-- <LogOut size={16} strokeWidth={3} /> -->
				<FontAwesomeIcon icon={faRightFromBracket} />
			</button>
		{/if}
		{#if page.route.id == '/'}
			<a
				href="https://github.com/fnschmidt/campus-unbloat"
				target="_blank"
				aria-label="Quellcode (GitHub)"
				class="btn my-1 rounded-full btn-soft btn-sm"
				><FontAwesomeIcon icon={faGithub} />Quellcode</a
			>
		{/if}
	</div>
</nav>
