<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface SpecialDay {
		id: number;
		name: string;
		nameAr: string;
		date: string;
		description: string;
		descriptionAr: string;
		type: string;
		typeAr: string;
		daysRemaining: number;
	}

	let specialDays: SpecialDay[] = [];
	let closestDay: SpecialDay | null = null;
	let loading = true;
	let error = '';

	const islamicDaysAr: Record<string, { nameAr: string; descriptionAr: string; typeAr: string }> = {
		Ramadan: {
			nameAr: 'شهر رمضان المبارك',
			descriptionAr: 'شهر الصيام والتقوى والعبادة، فيه أُنزل القرآن هدىً للناس',
			typeAr: 'شهر مبارك'
		},
		'Laylat al-Qadr': {
			nameAr: 'ليلة القدر',
			descriptionAr: 'ليلة خير من ألف شهر، تتنزل فيها الملائكة والروح',
			typeAr: 'ليلة مباركة'
		},
		'Eid ul Fitr': {
			nameAr: 'عيد الفطر المبارك',
			descriptionAr: 'عيد الفرح والشكر بعد إتمام صيام شهر رمضان',
			typeAr: 'عيد'
		},
		Hajj: {
			nameAr: 'موسم الحج',
			descriptionAr: 'الركن الخامس من أركان الإسلام، حج البيت لمن استطاع إليه سبيلا',
			typeAr: 'فريضة'
		},
		'Eid ul Adha': {
			nameAr: 'عيد الأضحى المبارك',
			descriptionAr: 'عيد الضحية والتضحية، إحياء لسنة إبراهيم عليه السلام',
			typeAr: 'عيد'
		},
		Muharram: {
			nameAr: 'رأس السنة الهجرية',
			descriptionAr: 'بداية العام الهجري الجديد، شهر الله المحرم',
			typeAr: 'سنة جديدة'
		},
		Ashura: {
			nameAr: 'يوم عاشوراء',
			descriptionAr: 'يوم نجى الله فيه موسى عليه السلام وقومه، يستحب صيامه',
			typeAr: 'يوم مبارك'
		},
		Mawlid: {
			nameAr: 'المولد النبوي الشريف',
			descriptionAr: 'ذكرى مولد خاتم الأنبياء محمد صلى الله عليه وسلم',
			typeAr: 'ذكرى نبوية'
		},
		'Isra and Miraj': {
			nameAr: 'الإسراء والمعراج',
			descriptionAr: 'ذكرى رحلة النبي الليلية من المسجد الحرام إلى المسجد الأقصى ثم إلى السماء',
			typeAr: 'ذكرى نبوية'
		},
		'Lailat al Barat': {
			nameAr: 'ليلة النصف من شعبان',
			descriptionAr: 'ليلة مباركة يرفع فيها العمل إلى الله تعالى',
			typeAr: 'ليلة مباركة'
		}
	};

	function calculateDaysRemaining(dateStr: string): number {
		if (!dateStr || dateStr === 'TBD') return 999;

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const targetDate = new Date(dateStr);
		targetDate.setHours(0, 0, 0, 0);

		const diffTime = targetDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	}

	function getArabicTranslation(name: string): {
		nameAr: string;
		descriptionAr: string;
		typeAr: string;
	} {
		// Find matching translation
		for (const [key, value] of Object.entries(islamicDaysAr)) {
			if (
				name.toLowerCase().includes(key.toLowerCase()) ||
				key.toLowerCase().includes(name.toLowerCase().split(' ')[0])
			) {
				return value;
			}
		}
		return { nameAr: name, descriptionAr: 'مناسبة إسلامية مباركة', typeAr: 'مناسبة' };
	}

	function formatDaysRemaining(days: number): string {
		if (days === 0) return 'اليوم!';
		if (days === 1) return 'غداً';
		if (days === 2) return 'بعد يومين';
		if (days <= 10) return `بعد ${days} أيام`;
		return `بعد ${days} يوماً`;
	}

	onMount(async () => {
		try {
			const response = await fetch('/api/islamic-data/special-days');
			if (!response.ok) {
				throw new Error(`خطأ: ${response.status}`);
			}
			const data = await response.json();

			// Process and translate special days
			const rawDays = data.specialDays || [];
			specialDays = rawDays
				.map((day: any) => {
					const translation = getArabicTranslation(day.name);
					const daysRemaining = calculateDaysRemaining(day.date);
					return {
						...day,
						nameAr: translation.nameAr,
						descriptionAr: translation.descriptionAr,
						typeAr: translation.typeAr,
						daysRemaining
					};
				})
				.filter((day: SpecialDay) => day.daysRemaining >= 0)
				.sort((a: SpecialDay, b: SpecialDay) => a.daysRemaining - b.daysRemaining);

			// Set the closest upcoming day
			if (specialDays.length > 0) {
				closestDay = specialDays[0];
			}
		} catch (err) {
			console.error('خطأ في جلب الأيام الإسلامية:', err);
			error = 'فشل في تحميل الأيام الإسلامية';
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
					d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
			المناسبات الإسلامية
		</h2>
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-48">
			<div class="preloader-ring" />
		</div>
	{:else if error}
		<div class="text-[#f43f5e] text-center py-8 text-lg">{error}</div>
	{:else}
		<!-- Closest Day Hero Card -->
		{#if closestDay}
			<div
				class="relative mb-8 overflow-hidden rounded-2xl"
				in:scale={{ duration: 500, easing: quintOut }}
			>
				<div
					class="absolute inset-0 bg-gradient-to-l from-[#d4af37]/30 via-[#d4af37]/10 to-transparent"
				/>
				<div class="absolute inset-0 islamic-pattern opacity-50" />

				<div class="relative glass-card-gold p-8 border-2 border-[#d4af37]">
					<div class="flex flex-col md:flex-row items-center justify-between gap-6">
						<div class="text-center md:text-right">
							<div class="flex items-center justify-center md:justify-start gap-2 mb-2">
								<span class="days-badge text-lg px-4 py-2">
									{formatDaysRemaining(closestDay.daysRemaining)}
								</span>
								<span class="text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full text-sm">
									{closestDay.typeAr}
								</span>
							</div>
							<h3 class="text-3xl md:text-4xl font-bold text-[#d4af37] mb-3 text-glow-gold">
								{closestDay.nameAr}
							</h3>
							<p class="text-[#a0a0b0] text-lg max-w-xl">
								{closestDay.descriptionAr}
							</p>
						</div>

						<!-- Days Counter Display -->
						<div class="text-center">
							<div class="relative">
								<div
									class="w-32 h-32 rounded-full border-4 border-[#d4af37] flex items-center justify-center bg-[#d4af37]/10"
								>
									<div class="text-center">
										<span class="text-5xl font-bold text-[#d4af37] countdown-display">
											{closestDay.daysRemaining}
										</span>
										<p class="text-[#a0a0b0] text-sm">يوم</p>
									</div>
								</div>
								<div class="absolute inset-0 rounded-full animate-ping opacity-10 bg-[#d4af37]" />
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Other Special Days List -->
		{#if specialDays.length > 1}
			<h3 class="text-xl font-bold text-[#f0f0f5] mb-4">المناسبات القادمة</h3>
			<div class="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide pl-2">
				{#each specialDays.slice(1) as day, i (day.id)}
					<div class="special-day-card p-5" in:fly={{ x: 30, delay: i * 80, duration: 400 }}>
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<div class="flex items-center gap-3 mb-2">
									<h4 class="font-bold text-lg text-[#f0f0f5]">{day.nameAr}</h4>
									<span class="text-xs bg-[#06b6d4]/20 text-[#06b6d4] px-2 py-1 rounded-full">
										{day.typeAr}
									</span>
								</div>
								<p class="text-[#a0a0b0] text-sm leading-relaxed">
									{day.descriptionAr}
								</p>
							</div>

							<div class="text-left flex-shrink-0">
								<span class="days-badge-secondary px-4 py-2 rounded-full text-sm whitespace-nowrap">
									{formatDaysRemaining(day.daysRemaining)}
								</span>
								<p class="text-[#6a6a7a] text-xs mt-2 text-center">
									{day.daysRemaining} يوم
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else if specialDays.length === 0}
			<p class="text-[#a0a0b0] text-center py-8">لا توجد مناسبات قادمة</p>
		{/if}
	{/if}
</div>
