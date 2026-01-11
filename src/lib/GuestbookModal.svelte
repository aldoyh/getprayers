<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let isOpen = false;

	interface FormData {
		name: string;
		message: string;
	}

	let formData: FormData = {
		name: '',
		message: ''
	};

	let isLoading = false;
	let error: string | null = null;
	let success = false;

	async function handleSubmit() {
		error = null;

		if (!formData.name.trim() || !formData.message.trim()) {
			error = 'يرجى ملء جميع الحقول';
			return;
		}

		isLoading = true;

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Reset form
			formData = { name: '', message: '' };
			success = true;
			
			// Close after success message
			setTimeout(() => {
				handleClose();
				success = false;
			}, 2000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'فشل في الإرسال';
		} finally {
			isLoading = false;
		}
	}

	function handleClose() {
		isOpen = false;
		error = null;
		success = false;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') handleClose();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
		on:click={handleBackdropClick}
		role="presentation"
		transition:fade={{ duration: 300 }}
	>
		<div
			class="glass-card p-8 max-w-lg w-full border-2 border-[#d4af37]/30"
			role="dialog"
			aria-modal="true"
			aria-labelledby="guestbook-title"
			transition:scale={{ duration: 400, easing: quintOut }}
		>
			{#if success}
				<!-- Success Message -->
				<div class="text-center py-8" transition:fade>
					<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[#10b981]/20 flex items-center justify-center">
						<svg class="w-10 h-10 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h3 class="text-2xl font-bold text-[#d4af37] mb-2">تم بنجاح!</h3>
					<p class="text-[#a0a0b0]">شكراً لك على المشاركة</p>
				</div>
			{:else}
				<!-- Header -->
				<div class="text-center mb-8">
					<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
						<svg class="w-8 h-8 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
					</div>
					<h2 id="guestbook-title" class="text-3xl font-bold text-[#d4af37]">سجل الزوار</h2>
					<p class="text-[#6a6a7a] mt-2">شاركنا بكلمة أو دعاء</p>
				</div>

				<!-- Form -->
				<form on:submit|preventDefault={handleSubmit} class="space-y-5">
					<div>
						<label for="name" class="block text-[#a0a0b0] text-sm mb-2">الاسم</label>
						<input
							type="text"
							id="name"
							name="name"
							bind:value={formData.name}
							placeholder="أدخل اسمك الكريم"
							class="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[#d4af37]/20 text-[#f0f0f5] placeholder:text-[#6a6a7a] focus:outline-none focus:border-[#d4af37]/50 focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
							disabled={isLoading}
						/>
					</div>

					<div>
						<label for="message" class="block text-[#a0a0b0] text-sm mb-2">الرسالة</label>
						<textarea
							id="message"
							name="message"
							bind:value={formData.message}
							rows="4"
							placeholder="اكتب رسالتك أو دعاءك هنا..."
							class="w-full px-4 py-3 rounded-xl bg-[#1a1a24] border border-[#d4af37]/20 text-[#f0f0f5] placeholder:text-[#6a6a7a] focus:outline-none focus:border-[#d4af37]/50 focus:ring-2 focus:ring-[#d4af37]/20 transition-all resize-none"
							disabled={isLoading}
						></textarea>
					</div>

					{#if error}
						<div class="bg-[#f43f5e]/10 border border-[#f43f5e]/30 rounded-lg p-3 text-center">
							<p class="text-[#f43f5e] text-sm">{error}</p>
						</div>
					{/if}

					<div class="flex gap-4 pt-2">
						<button
							type="submit"
							class="flex-1 btn-gold py-3 text-lg flex items-center justify-center gap-2"
							disabled={isLoading}
						>
							{#if isLoading}
								<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								<span>جارٍ الإرسال...</span>
							{:else}
								<span>إرسال</span>
							{/if}
						</button>
						<button
							type="button"
							on:click={handleClose}
							class="flex-1 btn-outline-gold py-3 text-lg"
							disabled={isLoading}
						>
							إغلاق
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}
