<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	export let isRecommendationMode = false;

	const dispatch = createEventDispatcher();
	let mobileOpen = false;

	const navLinks = [
		{ label: 'الرئيسية', href: '#home' },
		{ label: 'مواقيت الصلاة', href: '#prayer-times' },
		{ label: 'المناسبات الإسلامية', href: '#special-days' }
	];

	function goHome() {
		dispatch('viewHome');
		mobileOpen = false;
	}

	function startRecommendation() {
		dispatch('startRecommendation');
		mobileOpen = false;
	}

	function openGuestbook() {
		dispatch('openGuestbook');
		mobileOpen = false;
	}

	function handleNavClick() {
		mobileOpen = false;
	}
</script>

<header class="fixed inset-x-0 top-0 z-50" aria-label="Primary">
	<div class="backdrop-blur-xl border-b border-[#d4af37]/20 bg-[#0a0a0f]/90 shadow-lg shadow-black/20">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:py-5">
			<!-- Mobile Menu Button (Right side in RTL) -->
			<button
				class="flex items-center gap-2 rounded-xl border border-[#d4af37]/30 px-4 py-2 text-sm text-[#d4af37] md:hidden hover:bg-[#d4af37]/10 transition-colors"
				on:click={() => (mobileOpen = !mobileOpen)}
				aria-expanded={mobileOpen}
				aria-label="قائمة التنقل"
			>
				<span class="text-lg">{mobileOpen ? '✕' : '☰'}</span>
				<span>{mobileOpen ? 'إغلاق' : 'القائمة'}</span>
			</button>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-8 text-sm font-medium text-[#a0a0b0] md:flex">
				{#each navLinks as link}
					<a
						href={link.href}
						class="transition-all duration-300 hover:text-[#d4af37] relative group"
						on:click={handleNavClick}
					>
						{link.label}
						<span class="absolute bottom-0 right-0 w-0 h-0.5 bg-[#d4af37] transition-all duration-300 group-hover:w-full"></span>
					</a>
				{/each}
			</nav>

			<!-- Desktop Buttons -->
			<div class="hidden gap-3 md:flex">
				<button
					class="btn-outline-gold text-sm"
					on:click={startRecommendation}
				>
					{#if isRecommendationMode}
						العودة للرئيسية
					{:else}
						خطة اليوم
					{/if}
				</button>
				<button
					class="btn-gold text-sm"
					on:click={openGuestbook}
				>
					سجل الزوار
				</button>
			</div>

			<!-- Logo (Left side in RTL) -->
			<button
				class="flex flex-col items-end text-left"
				on:click={goHome}
				aria-label="العودة للرئيسية"
			>
				<div class="flex items-center gap-2">
					<!-- Crescent Moon Icon -->
					<svg class="w-7 h-7 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/>
					</svg>
					<span class="text-xl font-bold tracking-tight text-[#d4af37]">الصلاة</span>
				</div>
				<span class="text-[0.65rem] uppercase tracking-[0.3em] text-[#6a6a7a]">تطبيق إسلامي</span>
				<p class="text-[0.6rem] text-[#6a6a7a] mt-1">
					في ثواب المرحوم الحاج الأستاذ / عيسى بن حسن بن أحمد الدوي
				</p>
			</button>
		</div>

		<!-- Mobile Menu -->
		{#if mobileOpen}
			<div 
				class="border-t border-[#d4af37]/20 px-6 pb-6 pt-4 space-y-4"
				transition:slide={{ duration: 300 }}
			>
				<nav class="flex flex-col gap-3">
					{#each navLinks as link}
						<a
							href={link.href}
							class="text-[#a0a0b0] py-2 text-lg transition-colors duration-200 hover:text-[#d4af37]"
							on:click={handleNavClick}
						>
							{link.label}
						</a>
					{/each}
				</nav>
				<div class="flex flex-col gap-3 pt-4 border-t border-[#d4af37]/10">
					<button
						class="btn-outline-gold w-full py-3"
						on:click={startRecommendation}
					>
						{#if isRecommendationMode}
							العودة للرئيسية
						{:else}
							خطة اليوم
						{/if}
					</button>
					<button
						class="btn-gold w-full py-3"
						on:click={openGuestbook}
					>
						سجل الزوار
					</button>
				</div>
			</div>
		{/if}
	</div>
</header>
