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

	let isLoading = true;
	let isGuestbookOpen = false;

	onMount(() => {
		// Simulate loading time for smooth preloader experience
		const timer = setTimeout(() => {
			isLoading = false;
		}, 2000);

		return () => clearTimeout(timer);
	});

	function openGuestbook() {
		isGuestbookOpen = true;
	}
</script>

<!-- Preloader -->
<Preloader loading={isLoading} />

<!-- Main Content -->
{#if !isLoading}
	<div in:fade={{ duration: 800, delay: 300, easing: quintOut }}>
		<!-- Background -->
		<div class="fixed inset-0 islamic-bg">
			<div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]"></div>
		</div>

		<!-- Main Container -->
		<div class="relative min-h-screen">
			<Header on:openGuestbook={openGuestbook} />

			<main class="pt-24 pb-8 px-4 md:px-6 lg:px-8">
				<div class="max-w-6xl mx-auto space-y-16">
					<!-- Hero Section -->
					<section 
						id="home" 
						class="min-h-[60vh] flex items-center justify-center py-12"
					>
						<Home on:openGuestbook={openGuestbook} />
					</section>

					<!-- Prayer Times Section -->
					<section id="prayer-times">
						<PrayerTimesWidget />
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
