<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface VerseData {
		id: number;
		number: number;
		text: string;
		transliteration: string;
		translations: {
			en: string;
			ar?: string;
		};
		chapter: {
			id: number;
			name: string;
			transliteration: string;
			translations: {
				en: string;
			};
		};
	}

	let verse: VerseData | null = null;
	let loading = true;
	let error = '';

	// Total number of verses in Quran
	const TOTAL_VERSES = 6236;

	// Generate a "random" verse based on current date (so it changes daily but is consistent)
	function getDailyVerseNumber(): number {
		const today = new Date();
		const startOfYear = new Date(today.getFullYear(), 0, 0);
		const diff = today.getTime() - startOfYear.getTime();
		const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
		
		// Use a deterministic formula to pick a verse based on day
		// This ensures the same verse shows for everyone on the same day
		const seed = dayOfYear + today.getFullYear() * 366;
		return (seed % TOTAL_VERSES) + 1;
	}

	onMount(async () => {
		try {
			const verseNumber = getDailyVerseNumber();
			const response = await fetch(
				`https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/verses/${verseNumber}.json`
			);

			if (!response.ok) {
				throw new Error(`خطأ في جلب الآية: ${response.status}`);
			}

			verse = await response.json();
		} catch (err) {
			console.error('خطأ في جلب آية اليوم:', err);
			error = 'فشل في تحميل آية اليوم';
		} finally {
			loading = false;
		}
	});
</script>

<div class="glass-card p-8 islamic-pattern">
	<div class="flex items-center justify-between mb-8">
		<h2 class="text-3xl font-bold text-[#d4af37] flex items-center gap-3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
				/>
			</svg>
			آية اليوم
		</h2>
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-48">
			<div class="preloader-ring" />
		</div>
	{:else if error}
		<div class="text-[#f43f5e] text-center py-8 text-lg">{error}</div>
	{:else if verse}
		<div class="relative" in:scale={{ duration: 500, easing: quintOut }}>
			<!-- Decorative Background -->
			<div class="absolute inset-0 bg-gradient-to-l from-[#d4af37]/10 via-transparent to-[#10b981]/5 rounded-2xl" />
			<div class="absolute inset-0 islamic-pattern opacity-30 rounded-2xl" />

			<!-- Main Verse Card -->
			<div class="relative glass-card-gold p-8 md:p-10 border border-[#d4af37]/30 rounded-2xl">
				<!-- Bismillah Decoration -->
				<div class="flex justify-center mb-6" in:fade={{ delay: 200, duration: 400 }}>
					<div class="w-24 h-1 bg-gradient-to-l from-transparent via-[#d4af37] to-transparent rounded-full" />
				</div>

				<!-- Arabic Verse Text -->
				<div class="text-center mb-8" in:fly={{ y: 20, delay: 300, duration: 500 }}>
					<p class="text-3xl md:text-4xl lg:text-5xl text-[#d4af37] font-bold leading-loose mb-4 text-glow-gold quran-text">
						﴿ {verse.text} ﴾
					</p>
				</div>

				<!-- Transliteration -->
				<div class="text-center mb-6" in:fly={{ y: 15, delay: 400, duration: 500 }}>
					<p class="text-lg text-[#a0a0b0] italic" dir="ltr">
						{verse.transliteration}
					</p>
				</div>

				<!-- English Translation -->
				<div class="text-center mb-8" in:fly={{ y: 15, delay: 500, duration: 500 }}>
					<p class="text-xl text-[#f0f0f5] leading-relaxed max-w-3xl mx-auto" dir="ltr">
						"{verse.translations.en}"
					</p>
				</div>

				<!-- Bottom Decoration -->
				<div class="flex justify-center mb-6" in:fade={{ delay: 600, duration: 400 }}>
					<div class="w-24 h-1 bg-gradient-to-l from-transparent via-[#d4af37] to-transparent rounded-full" />
				</div>

				<!-- Surah Info -->
				<div
					class="flex flex-wrap items-center justify-center gap-4 text-center"
					in:fade={{ delay: 700, duration: 400 }}
				>
					<div class="flex items-center gap-2">
						<span class="text-[#d4af37] bg-[#d4af37]/10 px-4 py-2 rounded-full text-lg font-bold">
							{verse.chapter.name}
						</span>
						<span class="text-[#a0a0b0] text-sm">
							({verse.chapter.transliteration})
						</span>
					</div>
					<span class="text-[#6a6a7a]">•</span>
					<div class="flex items-center gap-2">
						<span class="text-[#06b6d4] bg-[#06b6d4]/10 px-3 py-1 rounded-full text-sm" dir="ltr">
							{verse.chapter.translations.en}
						</span>
					</div>
					<span class="text-[#6a6a7a]">•</span>
					<div class="text-[#a0a0b0]" dir="ltr">
						<span class="text-[#10b981]">Verse {verse.number}</span> of Surah {verse.chapter.id}
					</div>
				</div>

				<!-- Share Button (Optional Enhancement) -->
				<div class="flex justify-center mt-8" in:fade={{ delay: 800, duration: 400 }}>
					<button
						class="btn-outline-gold flex items-center gap-2 text-sm px-6 py-2"
						on:click={() => {
							const shareText = `${verse?.text}\n\n"${verse?.translations.en}"\n\n- ${verse?.chapter.name} (${verse?.chapter.transliteration}), Verse ${verse?.number}`;
							if (navigator.share) {
								navigator.share({ title: 'آية اليوم', text: shareText });
							} else {
								navigator.clipboard.writeText(shareText);
								alert('تم نسخ الآية');
							}
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
						</svg>
						مشاركة الآية
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.quran-text {
		font-family: 'Amiri Quran', 'Scheherazade New', 'Traditional Arabic', 'Tajawal', serif;
		text-rendering: optimizeLegibility;
		font-feature-settings: 'calt', 'liga';
		word-spacing: 0.15em;
		line-height: 2.2;
		letter-spacing: 0.02em;
	}
</style>
