<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const dispatch = createEventDispatcher();
</script>

<div class="w-full text-center md:text-right" in:fade={{ duration: 800, easing: quintOut }}>
	<!-- Hero Section -->
	<div class="relative mb-12">
		<!-- Decorative Element -->
		<div class="absolute -top-10 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-3xl" />

		<!-- Main Title -->
		<h1
			class="text-5xl md:text-7xl font-bold mb-6 leading-tight"
			in:fly={{ y: 30, delay: 200, duration: 800 }}
		>
			<span class="text-[#f0f0f5]">بسم الله</span>
			<br />
			<span class="gradient-gold gradient-text">الرحمن الرحيم</span>
		</h1>

		<!-- Subtitle -->
		<p
			class="text-xl md:text-2xl text-[#a0a0b0] mb-8 max-w-2xl mx-auto md:mx-0"
			in:fly={{ y: 20, delay: 400, duration: 600 }}
		>
			تطبيقك الشامل لمواقيت الصلاة والمناسبات الإسلامية المباركة
		</p>

		<!-- Decorative Line -->
		<div
			class="w-24 h-1 bg-gradient-to-l from-[#d4af37] to-[#d4af37]/20 mx-auto md:mx-0 mb-8"
			in:fade={{ delay: 600, duration: 500 }}
		/>
	</div>

	<!-- Action Buttons -->
	<div
		class="flex flex-wrap items-center justify-center md:justify-start gap-4"
		in:fly={{ y: 20, delay: 600, duration: 600 }}
	>
		<button
			on:click={() => dispatch('openGuestbook')}
			class="btn-gold flex items-center gap-2 text-lg px-8 py-4"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
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

		<a href="#prayer-times" class="btn-outline-gold flex items-center gap-2 text-lg px-8 py-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
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

	<!-- Quranic Verse -->
	<div
		class="mt-16 p-8 glass-card max-w-3xl mx-auto md:mx-0"
		in:fade={{ delay: 800, duration: 600 }}
	>
		<p class="text-2xl md:text-3xl text-[#d4af37] font-medium leading-relaxed mb-4">
			﴿ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا ﴾
		</p>
		<p class="text-[#6a6a7a] text-sm">سورة النساء - الآية ١٠٣</p>
	</div>
</div>
