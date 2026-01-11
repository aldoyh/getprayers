<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	
	export let loading = true;
</script>

{#if loading}
	<div 
		class="preloader"
		out:fade={{ duration: 800, easing: quintOut }}
	>
		<div class="flex flex-col items-center gap-8">
			<!-- Islamic Crescent Moon with Star -->
			<div class="relative">
				<svg 
					class="crescent-moon w-24 h-24 text-[#d4af37]" 
					viewBox="0 0 100 100"
					fill="currentColor"
				>
					<path d="M50 10c-22.1 0-40 17.9-40 40s17.9 40 40 40c3.8 0 7.5-.5 11-1.5C53.1 82.3 47 70.4 47 57s6.1-25.3 14-31.5c-3.5-1-7.2-1.5-11-1.5z"/>
					<circle cx="70" cy="25" r="6"/>
				</svg>
				<div class="absolute inset-0 w-24 h-24 rounded-full animate-ping opacity-20 bg-[#d4af37]"></div>
			</div>
			
			<!-- Loading Ring -->
			<div class="preloader-ring"></div>
			
			<!-- Arabic Text -->
			<div class="text-center space-y-2">
				<h2 class="preloader-text text-2xl font-bold">جارٍ التحميل...</h2>
				<p class="text-[#a0a0b0] text-sm">بسم الله الرحمن الرحيم</p>
			</div>
		</div>
		
		<!-- Floating Particles Effect -->
		<div class="absolute inset-0 overflow-hidden pointer-events-none">
			{#each Array(20) as _, i}
				<div 
					class="absolute w-1 h-1 bg-[#d4af37] rounded-full opacity-30"
					style="
						left: {Math.random() * 100}%;
						top: {Math.random() * 100}%;
						animation: float {3 + Math.random() * 4}s ease-in-out infinite;
						animation-delay: {Math.random() * 2}s;
					"
				></div>
			{/each}
		</div>
	</div>
{/if}

<style>
	@keyframes float {
		0%, 100% {
			transform: translateY(0) translateX(0);
			opacity: 0.3;
		}
		50% {
			transform: translateY(-50px) translateX(10px);
			opacity: 0.8;
		}
	}
</style>
