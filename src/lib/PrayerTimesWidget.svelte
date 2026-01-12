<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	interface PrayerTiming {
		name: string;
		nameAr: string;
		time: string;
		timeMinutes: number;
	}

	interface PrayerData {
		location: string;
		locationAr: string;
		date: string;
		timings: Record<string, string>;
		hijriDate: string;
	}

	let prayerData: PrayerData = {
		location: '',
		locationAr: 'المحرق، البحرين',
		date: '',
		timings: {},
		hijriDate: ''
	};

	let prayers: PrayerTiming[] = [];
	let nextPrayer: PrayerTiming | null = null;
	let countdown = { hours: 0, minutes: 0, seconds: 0 };
	let loading = true;
	let error = '';
	let countdownInterval: ReturnType<typeof setInterval>;
	let currentPrayerIndex = -1;

	const prayerNamesAr: Record<string, string> = {
		fajr: 'الفجر',
		sunrise: 'الشروق',
		dhuhr: 'الظهر',
		asr: 'العصر',
		maghrib: 'المغرب',
		isha: 'العشاء'
	};

	const prayerOrder = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

	function parseTimeToMinutes(timeStr: string): number {
		const [time, modifier] = timeStr.split(' ');
		let [hours, minutes] = time.split(':').map(Number);

		if (modifier && modifier.toLowerCase() === 'pm' && hours !== 12) {
			hours += 12;
		} else if (modifier && modifier.toLowerCase() === 'am' && hours === 12) {
			hours = 0;
		}

		return hours * 60 + minutes;
	}

	function formatTimeAr(timeStr: string): string {
		const [time, modifier] = timeStr.split(' ');
		const period = modifier?.toLowerCase() === 'am' ? 'ص' : 'م';
		return `${time} ${period}`;
	}

	function calculateNextPrayer(): void {
		const now = new Date();
		const currentMinutes = now.getHours() * 60 + now.getMinutes();

		let found = false;
		for (let i = 0; i < prayers.length; i++) {
			if (prayers[i].timeMinutes > currentMinutes) {
				nextPrayer = prayers[i];
				currentPrayerIndex = i;
				found = true;
				break;
			}
		}

		// If no next prayer today, use first prayer of next day
		if (!found && prayers.length > 0) {
			nextPrayer = prayers[0];
			currentPrayerIndex = 0;
		}
	}

	function updateCountdown(): void {
		if (!nextPrayer) return;

		const now = new Date();
		const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
		const targetSeconds = nextPrayer.timeMinutes * 60;

		let diffSeconds = targetSeconds - currentSeconds;

		// If negative, add 24 hours (next day)
		if (diffSeconds < 0) {
			diffSeconds += 24 * 3600;
		}

		// Check if we've passed this prayer and need to update to next
		if (diffSeconds === 0) {
			calculateNextPrayer();
			return;
		}

		countdown = {
			hours: Math.floor(diffSeconds / 3600),
			minutes: Math.floor((diffSeconds % 3600) / 60),
			seconds: diffSeconds % 60
		};
	}

	function processPrayerData(): void {
		prayers = prayerOrder
			.filter((name) => prayerData.timings[name])
			.map((name) => ({
				name,
				nameAr: prayerNamesAr[name] || name,
				time: prayerData.timings[name],
				timeMinutes: parseTimeToMinutes(prayerData.timings[name])
			}));

		calculateNextPrayer();
	}

	onMount(async () => {
		try {
			const response = await fetch('/api/islamic-data/prayer-times');
			if (!response.ok) {
				throw new Error(`خطأ: ${response.status}`);
			}
			const data = await response.json();
			prayerData = data.prayerTimings || prayerData;
			prayerData.locationAr = 'المحرق، البحرين';
			processPrayerData();

			// Start countdown interval
			countdownInterval = setInterval(() => {
				updateCountdown();

				// Check if we need to recalculate next prayer (hourly)
				const now = new Date();
				if (now.getMinutes() === 0 && now.getSeconds() === 0) {
					calculateNextPrayer();
				}
			}, 1000);

			updateCountdown();
		} catch (err) {
			console.error('خطأ في جلب مواقيت الصلاة:', err);
			error = 'فشل في تحميل مواقيت الصلاة';
		} finally {
			loading = false;
		}
	});

	onDestroy(() => {
		if (countdownInterval) {
			clearInterval(countdownInterval);
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
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
			مواقيت الصلاة
		</h2>
		{#if !loading && !error}
			<div class="text-left text-sm">
				<p class="text-[#a0a0b0]">{prayerData.locationAr}</p>
				<p class="text-[#6a6a7a]">{prayerData.hijriDate}</p>
			</div>
		{/if}
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-48">
			<div class="preloader-ring" />
		</div>
	{:else if error}
		<div class="text-[#f43f5e] text-center py-8 text-lg">{error}</div>
	{:else}
		<!-- Next Prayer Countdown Hero -->
		{#if nextPrayer}
			<div
				class="glass-card-gold p-8 rounded-2xl mb-8 text-center relative overflow-hidden"
				in:fade={{ duration: 500 }}
			>
				<div class="absolute inset-0 bg-gradient-to-l from-[#d4af37]/10 to-transparent" />
				<div class="relative z-10">
					<p class="text-[#a0a0b0] text-lg mb-2">الصلاة القادمة</p>
					<h3 class="text-4xl font-bold text-[#d4af37] mb-4 text-glow-gold">{nextPrayer.nameAr}</h3>
					<p class="text-[#f0f0f5] text-xl mb-6">{formatTimeAr(nextPrayer.time)}</p>

					<!-- Countdown Timer -->
					<div class="flex justify-center items-center gap-4">
						<div class="flex flex-col items-center">
							<span class="text-5xl font-bold text-[#d4af37] countdown-display">
								{String(countdown.hours).padStart(2, '0')}
							</span>
							<span class="text-[#6a6a7a] text-sm mt-1">ساعة</span>
						</div>
						<span class="text-3xl text-[#d4af37] font-bold">:</span>
						<div class="flex flex-col items-center">
							<span class="text-5xl font-bold text-[#d4af37] countdown-display">
								{String(countdown.minutes).padStart(2, '0')}
							</span>
							<span class="text-[#6a6a7a] text-sm mt-1">دقيقة</span>
						</div>
						<span class="text-3xl text-[#d4af37] font-bold">:</span>
						<div class="flex flex-col items-center">
							<span class="text-5xl font-bold text-[#d4af37] countdown-display">
								{String(countdown.seconds).padStart(2, '0')}
							</span>
							<span class="text-[#6a6a7a] text-sm mt-1">ثانية</span>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Prayer Times Grid -->
		<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
			{#each prayers as prayer, i (prayer.name)}
				<div
					class="prayer-card p-5 text-center {i === currentPrayerIndex ? 'active' : ''}"
					in:fly={{ y: 20, delay: i * 100, duration: 400 }}
				>
					<h3
						class="font-bold text-xl mb-2 {i === currentPrayerIndex
							? 'text-[#d4af37]'
							: 'text-[#f0f0f5]'}"
					>
						{prayer.nameAr}
					</h3>
					<p class="text-lg {i === currentPrayerIndex ? 'text-[#d4af37]' : 'text-[#06b6d4]'}">
						{formatTimeAr(prayer.time)}
					</p>
					{#if i === currentPrayerIndex}
						<div class="mt-2">
							<span class="text-xs bg-[#d4af37]/20 text-[#d4af37] px-2 py-1 rounded-full">
								قادمة
							</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
