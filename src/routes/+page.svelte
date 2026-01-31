<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import Home from '$lib/Home.svelte';
	import Preloader from '$lib/Preloader.svelte';
	import SpecialIslamicDaysWidget from '$lib/SpecialIslamicDaysWidget.svelte';
	import PrayerTimesWidget from '$lib/PrayerTimesWidget.svelte';
	import GuestbookModal from '$lib/GuestbookModal.svelte';
	import QuranVerseOfTheDay from '$lib/QuranVerseOfTheDay.svelte';

	let isLoading = true;
	let isGuestbookOpen = false;

	onMount(() => {
		// Logic handles by Preloader component
	});

	function handlePreloaderComplete() {
		isLoading = false;
	}

	function openGuestbook() {
		isGuestbookOpen = true;
	}
</script>

<!-- Background - Always visible behind everything -->
<div class="fixed inset-0 islamic-bg">
	<div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]" />
</div>

<!-- Preloader -->
<Preloader loading={isLoading} on:complete={handlePreloaderComplete} />

<!-- Main Content -->
{#if !isLoading}
	<div in:fade={{ duration: 800, delay: 300, easing: quintOut }}>
		<!-- Main Container -->
		<div class="relative min-h-screen">
			<Header on:openGuestbook={openGuestbook} />

			<main class="pt-20 pb-8 px-4 md:px-6 md:pt-24 lg:px-8">
				<div class="max-w-6xl mx-auto space-y-8 md:space-y-16">
					<!-- Hero Section -->
					<section id="home" class="flex items-center justify-center py-6 md:min-h-[60vh] md:py-12">
						<Home on:openGuestbook={openGuestbook} />
					</section>

					<!-- Prayer Times Section -->
					<section id="prayer-times">
						<PrayerTimesWidget />
					</section>

					<!-- Quran Verse of the Day Section -->
					<section id="quran-verse">
						<QuranVerseOfTheDay />
					</section>

					<!-- Special Islamic Days Section -->
					<section id="special-days">
						<SpecialIslamicDaysWidget />
					</section>
				</div>
			</main>

			<Footer />
		</div>

		<!-- Modals -->
		<GuestbookModal bind:isOpen={isGuestbookOpen} />
	</div>
{/if}
