<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';

	const dispatch = createEventDispatcher();

	let particles: Array<{ id: number; x: number; y: number; size: number; delay: number }> = [];

	onMount(() => {
		// Generate floating particles for ambient effect
		particles = Array.from({ length: 12 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 4 + 2,
			delay: Math.random() * 5
		}));
	});
</script>

<div class="w-full text-center md:text-right relative" in:fade={{ duration: 800, easing: quintOut }}>
	<!-- Floating Particles -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		{#each particles as particle (particle.id)}
			<div
				class="absolute w-1 h-1 rounded-full bg-[#d4af37]/30 animate-float"
				style="left: {particle.x}%; top: {particle.y}%; width: {particle.size}px; height: {particle.size}px; animation-delay: {particle.delay}s;"
			/>
		{/each}
	</div>

	<!-- Hero Section -->
	<div class="relative mb-16">
		<!-- Multiple Decorative Elements -->
		<div class="absolute -top-20 right-0 w-48 h-48 bg-[#d4af37]/15 rounded-full blur-[80px] animate-pulse-slow" />
		<div class="absolute -top-10 left-1/4 w-32 h-32 bg-[#10b981]/10 rounded-full blur-[60px] animate-pulse-slow" style="animation-delay: 1s;" />
		<div class="absolute top-20 right-1/3 w-24 h-24 bg-[#06b6d4]/10 rounded-full blur-[50px] animate-pulse-slow" style="animation-delay: 2s;" />

		<!-- Crescent Moon Icon -->
		<div
			class="flex justify-center md:justify-start mb-8"
			in:scale={{ delay: 100, duration: 600, easing: elasticOut }}
		>
			<div class="relative">
				<svg
					class="w-16 h-16 md:w-20 md:h-20 text-[#d4af37] crescent-moon"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
				</svg>
				<div class="absolute inset-0 bg-[#d4af37]/20 rounded-full blur-xl animate-ping opacity-50" />
			</div>
		</div>

		<!-- Main Title with Enhanced Styling -->
		<h1
			class="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight"
			in:fly={{ y: 40, delay: 200, duration: 800 }}
		>
			<span class="text-[#f0f0f5] text-glow-subtle block mb-4">بسم الله</span>
			<span class="hero-gradient-text">الرحمن الرحيم</span>
		</h1>

		<!-- Animated Divider -->
		<div
			class="flex items-center justify-center md:justify-start gap-4 mb-8"
			in:fade={{ delay: 500, duration: 600 }}
		>
			<div class="flex-1 max-w-[100px] h-px bg-gradient-to-l from-[#d4af37] to-transparent" />
			<div class="w-3 h-3 bg-[#d4af37] rounded-full animate-pulse" />
			<div class="flex-1 max-w-[100px] h-px bg-gradient-to-r from-[#d4af37] to-transparent" />
		</div>

		<!-- Subtitle with Enhanced Animation -->
		<p
			class="text-xl md:text-2xl lg:text-3xl text-[#c0c0d0] mb-10 max-w-3xl mx-auto md:mx-0 font-light"
			in:fly={{ y: 25, delay: 400, duration: 600 }}
		>
			تطبيقك الشامل لمواقيت الصلاة والمناسبات الإسلامية المباركة
		</p>

		<!-- Feature Badges -->
		<div
			class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-10"
			in:fly={{ y: 20, delay: 550, duration: 500 }}
		>
			<span class="px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-sm flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				مواقيت دقيقة
			</span>
			<span class="px-4 py-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-sm flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
				تقويم إسلامي
			</span>
			<span class="px-4 py-2 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] text-sm flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
				آية يومية
			</span>
		</div>
	</div>

	<!-- Action Buttons with Enhanced Styling -->
	<div
		class="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-16"
		in:fly={{ y: 20, delay: 650, duration: 600 }}
	>
		<button
			on:click={() => dispatch('openGuestbook')}
			class="btn-gold flex items-center gap-3 text-lg px-10 py-5 group"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 transition-transform group-hover:rotate-12"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
				/>
			</svg>
			سجل الزوار
		</button>

		<a href="#prayer-times" class="btn-outline-gold flex items-center gap-3 text-lg px-10 py-5 group">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 transition-transform group-hover:scale-110"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			مواقيت الصلاة
		</a>
	</div>

	<!-- Featured Quranic Verse with Enhanced Design -->
	<div
		class="relative p-10 glass-card max-w-4xl mx-auto md:mx-0 overflow-hidden"
		in:scale={{ delay: 800, duration: 600, easing: quintOut }}
	>
		<!-- Decorative Corner Elements -->
		<div class="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#d4af37]/30 rounded-tr-3xl" />
		<div class="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#d4af37]/30 rounded-bl-3xl" />

		<!-- Quote Mark -->
		<div class="absolute top-4 right-4 text-[#d4af37]/20 text-6xl font-serif">❝</div>

		<p class="text-3xl md:text-4xl text-[#d4af37] font-medium leading-loose mb-6 text-glow-gold">
			﴿ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا ﴾
		</p>
		<div class="flex items-center justify-center md:justify-start gap-4">
			<div class="w-12 h-px bg-gradient-to-l from-[#d4af37] to-transparent" />
			<p class="text-[#a0a0b0] text-base">سورة النساء • الآية ١٠٣</p>
			<div class="w-12 h-px bg-gradient-to-r from-[#d4af37] to-transparent" />
		</div>
	</div>
</div>

<style>
	.animate-float {
		animation: float 6s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0) translateX(0);
			opacity: 0.3;
		}
		25% {
			transform: translateY(-20px) translateX(10px);
			opacity: 0.6;
		}
		50% {
			transform: translateY(-10px) translateX(-5px);
			opacity: 0.4;
		}
		75% {
			transform: translateY(-25px) translateX(5px);
			opacity: 0.5;
		}
	}

	.animate-pulse-slow {
		animation: pulseSlow 4s ease-in-out infinite;
	}

	@keyframes pulseSlow {
		0%, 100% {
			opacity: 0.5;
			transform: scale(1);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.1);
		}
	}

	.hero-gradient-text {
		background: linear-gradient(
			135deg,
			#10b981 0%,
			#06b6d4 40%,
			#10b981 70%,
			#34d399 100%
		);
		background-size: 200% auto;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
		animation: gradientShift 4s linear infinite;
		text-shadow: 0 0 80px rgba(16, 185, 129, 0.3), 0 0 120px rgba(6, 182, 212, 0.2);
		filter: drop-shadow(0 0 30px rgba(16, 185, 129, 0.3));
	}

	.text-glow-subtle {
		text-shadow: 0 0 40px rgba(240, 240, 245, 0.2);
	}

	@keyframes gradientShift {
		to {
			background-position: 200% center;
		}
	}
</style>
