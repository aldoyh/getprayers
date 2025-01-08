<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	export let isOpen = false;

	let modalContainer: HTMLElement;
	let formElements: HTMLElement;

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

	async function handleSubmit() {
		error = null;

		// Basic validation
		if (!formData.name.trim() || !formData.message.trim()) {
			error = 'Please fill out all fields';
			return;
		}

		isLoading = true;

		try {
			// Submit to API endpoint
			const response = await fetch('/api/guestbook', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				throw new Error('Failed to submit entry');
			}

			// Reset form and close modal
			formData = { name: '', message: '' };
			handleClose();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Submission failed';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		if (isOpen) {
			animateIn();
		}
	});

	function animateIn() {
		if (!modalContainer || !formElements) return;

		gsap.set(modalContainer, { opacity: 0, scale: 0.9 });
		gsap.set(formElements.children, { y: 30, opacity: 0 });

		const tl = gsap.timeline();
		tl.to(modalContainer, {
			opacity: 1,
			scale: 1,
			duration: 1,
			ease: 'expo.out'
		}).to(
			formElements.children,
			{
				y: 0,
				opacity: 1,
				duration: 0.7,
				stagger: 0.1,
				ease: 'back.out(1.7)'
			},
			'-=0.5'
		);
	}

	function handleClose() {
		const tl = gsap.timeline({
			onComplete: () => {
				isOpen = false;
			}
		});
		tl.to(formElements.children, {
			y: -30,
			opacity: 0,
			duration: 0.5,
			stagger: 0.05,
			ease: 'back.in(1.7)'
		}).to(
			modalContainer,
			{
				opacity: 0,
				scale: 0.9,
				duration: 0.5,
				ease: 'expo.in'
			},
			'-=0.3'
		);
	}
</script>

<div
	class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center {isOpen
		? ''
		: 'hidden'}"
	on:click|self={handleClose}
>
	<div
		bind:this={modalContainer}
		class="bg-slate-900/90 border border-slate-700 rounded-2xl p-8 max-w-lg w-full mx-4"
	>
		<div bind:this={formElements} class="space-y-6">
			<slot name="header">
				<h2 class="text-3xl font-bold text-white text-center">Share Your Memory</h2>
			</slot>

			<div class="space-y-4">
				<slot>
					<div>
						<input
							type="text"
							id="name"
							name="name"
							aria-label="Your Name"
							aria-required="true"
							bind:value={formData.name}
							placeholder="Your Name"
							class="w-full px-4 py-3 rounded-lg bg-white/10 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
							disabled={isLoading}
						/>
						{#if error && !formData.name}
							<p class="text-sm text-red-400 mt-1">Please enter your name</p>
						{/if}
					</div>

					<div>
						<textarea
							id="message"
							name="message"
							aria-label="Share your memory"
							aria-required="true"
							bind:value={formData.message}
							rows="4"
							placeholder="Share your memory..."
							class="w-full px-4 py-3 rounded-lg bg-white/10 border border-slate-600 text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
							disabled={isLoading}
						/>
						{#if error && !formData.message}
							<p class="text-sm text-red-400 mt-1">Please share your memory</p>
						{/if}
					</div>

					<div class="flex gap-4">
						<button
							on:click|preventDefault={handleSubmit}
							class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isLoading}
							aria-busy={isLoading}
						>
							{#if isLoading}
								<span class="flex items-center justify-center gap-2">
									<svg
										class="animate-spin h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										/>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Submitting...
								</span>
							{:else}
								Sign Guestbook
							{/if}
						</button>
						<button
							on:click={handleClose}
							class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isLoading}
						>
							Close
						</button>
					</div>
				</slot>
			</div>
		</div>
	</div>
</div>
