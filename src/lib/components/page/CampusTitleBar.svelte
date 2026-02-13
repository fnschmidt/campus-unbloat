<script lang="ts">
	import { resolve } from '$app/paths';
	import { LogOut } from '@lucide/svelte';

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
			<div tabindex="0" role="button" class="btn my-1 btn-circle btn-sm">
				<p class="font-mono text-[14px]">i</p>
			</div>
			<div tabindex="-1" class="dropdown-content card z-1 w-64 bg-base-100 shadow-md card-sm">
				<div class="card-body">
					<a href={resolve('/')} class="btn">Impressum</a>
					<a href={resolve('/')} class="btn">Datenschutz</a>
				</div>
			</div>
		</div>

		<div class="dropdown dropdown-center">
			<div tabindex="0" role="button" class="btn my-1 rounded-full btn-sm">Rechtliches</div>
			<div tabindex="-1" class="dropdown-content card z-1 w-64 bg-base-100 shadow-md card-sm">
				<div class="card-body">
					<a href={resolve('/')} class="btn">Impressum</a>
					<a href={resolve('/')} class="btn">Datenschutz</a>
				</div>
			</div>
		</div>

		<button class="btn my-1 rounded-full btn-sm"><LogOut size={16} strokeWidth={3} /></button>
	</div>
</nav>
