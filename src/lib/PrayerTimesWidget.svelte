<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let prayerTimings: {
		location: string;
		date: string;
		timings: Record<string, string>;
		nextPrayer: {
			name: string;
			time: string;
			countdown: string;
		};
		hijriDate: string;
	} = {
		location: '',
		date: '',
		timings: {},
		nextPrayer: { name: '', time: '', countdown: '' },
		hijriDate: ''
	};

	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const response = await fetch('/api/islamic-data/prayer-times');
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}
			const data = await response.json();
			prayerTimings = data.prayerTimings || prayerTimings;
		} catch (err) {
			console.error('Error fetching prayer timings:', err);
			error = 'Failed to load prayer timings';
		} finally {
			loading = false;
		}
	});
</script>

<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
	<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
		</svg>
		Prayer Times
	</h2>

	{#if loading}
		<div class="flex justify-center items-center h-32">
			<div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
		</div>
	{/if}

	{#if error}
		<div class="text-red-400 text-center py-4">{error}</div>
	{/if}

	{#if !loading && !error}
		<div class="space-y-4">
			<div class="text-center text-gray-300">
				<p class="text-lg">{prayerTimings.location}</p>
				<p class="text-sm">{prayerTimings.date} | {prayerTimings.hijriDate}</p>
			</div>

			<div class="grid grid-cols-2 gap-4">
				{#each Object.entries(prayerTimings.timings) as [prayer, time]}
					<div class="bg-slate-800/50 p-3 rounded-lg border border-slate-700 text-center">
						<h3 class="font-bold text-white capitalize">{prayer}</h3>
						<p class="text-cyan-300">{time}</p>
					</div>
				{/each}
			</div>

			{#if prayerTimings.nextPrayer.name}
				<div class="bg-amber-500/20 border border-amber-500/30 p-4 rounded-lg text-center">
					<h3 class="font-bold text-amber-300">Next Prayer</h3>
					<p class="text-white text-lg">{prayerTimings.nextPrayer.name} at {prayerTimings.nextPrayer.time}</p>
					<p class="text-gray-300 text-sm">Time remaining: {prayerTimings.nextPrayer.countdown}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>