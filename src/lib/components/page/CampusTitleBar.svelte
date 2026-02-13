<script lang="ts">
	import { resolve } from '$app/paths';
	import { Bug, Github, GithubIcon, LogOut } from '@lucide/svelte';

	// import Logo from '$lib/assets/logo-kiel-sailing-city.svelte';
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
			<div tabindex="-1" class="dropdown-content card z-1 w-48 glass shadow-md card-sm">
				<div class="card-body">
					<a href={resolve('/')} class="btn rounded-full btn-outline btn-primary"
						><Github size={18} />Quellcode</a
					>
					<a href={resolve('/')} class="btn rounded-full btn-outline btn-primary"
						><Bug size={18} /> Fehler melden</a
					>
				</div>
			</div>
		</div>

		<div class="dropdown dropdown-center">
			<div tabindex="0" role="button" class="btn my-1 rounded-full btn-soft btn-sm btn-primary">
				Rechtliches
			</div>
			<div tabindex="-1" class="dropdown-content card z-1 w-44 bg-base-100 shadow-md card-sm">
				<div class="card-body">
					<a href={resolve('/')} class="btn rounded-full btn-outline btn-primary">Impressum</a>
					<a href={resolve('/')} class="btn rounded-full btn-outline btn-primary">Datenschutz</a>
				</div>
			</div>
		</div>

		<button class="btn my-1 rounded-full btn-soft btn-sm btn-error"
			><LogOut size={16} strokeWidth={3} /></button
		>
	</div>
</nav>
