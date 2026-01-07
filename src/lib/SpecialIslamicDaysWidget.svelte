<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	
	export let specialDays: Array<{id: number, name: string, date: string, description: string, type: string}> = [];
	let loading = true;
	let error = '';
	
	onMount(async () => {
		try {
			const response = await fetch('/api/islamic-data/special-days');
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}
			const data = await response.json();
			specialDays = data.specialDays || [];
		} catch (err) {
			console.error('Error fetching special Islamic days:', err);
			error = 'Failed to load special Islamic days';
		} finally {
			loading = false;
		}
	});
</script>

<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
	<h2 class="text-2xl font-bold text-white mb-4 flex items-center">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
		</svg>
		Special Islamic Days
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
		{#if specialDays && specialDays.length > 0}
			<div class="space-y-4 max-h-96 overflow-y-auto pr-2">
				{#each specialDays as day, i}
					<div 
						transition:fade={{ delay: i * 100 }}
						class="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-colors"
					>
						<div class="flex justify-between items-start">
							<div>
								<h3 class="font-bold text-lg text-white">{day.name}</h3>
								<p class="text-cyan-300 text-sm">{day.type}</p>
							</div>
							<span class="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-sm font-medium">
								{day.date !== 'TBD' ? day.date : 'Date TBD'}
							</span>
						</div>
						<p class="text-gray-300 mt-2 text-sm">{day.description}</p>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-gray-300 text-center py-4">No special Islamic days found.</p>
		{/if}
	{/if}
</div>