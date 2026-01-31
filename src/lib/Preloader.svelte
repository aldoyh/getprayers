<script lang="ts">
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';
	import gsap from 'gsap';
	import { fade } from 'svelte/transition';

	export let loading = true;

	const dispatch = createEventDispatcher();
	let container;
	let logo;
	let particlesContainer;

	const colors = [
		'#d4af37', // Gold
		'#f1c40f', // Lighter Gold
		'#008080', // Teal
		'#50c878', // Emerald
		'#ffffff' // White
	];

	let particles = [];
	let tickerFunc;

	onMount(() => {
		if (!loading) return;

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		// Create particles
		for (let i = 0; i < 150; i++) {
			const p = document.createElement('div');
			p.classList.add('particle');

			// Random color from palette
			const color = colors[Math.floor(Math.random() * colors.length)];
			p.style.backgroundColor = color;
			p.style.boxShadow = `0 0 10px ${color}`;

			particlesContainer.appendChild(p);

			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 200 + 100;

			const vx = Math.cos(angle) * speed;
			const vy = Math.sin(angle) * speed;

			particles.push({
				el: p,
				x: centerX,
				y: centerY,
				vx,
				vy,
				opacity: 0,
				size: Math.random() * 4 + 2
			});

			p.style.width = p.style.height = particles[particles.length - 1].size + 'px';
			p.style.opacity = '0';
			p.style.transform = `translate(${centerX}px, ${centerY}px)`;
		}

		tickerFunc = () => {
			particles.forEach((particle) => {
				particle.vx *= 0.96;
				particle.vy *= 0.96;

				particle.x += particle.vx * 0.016;
				particle.y += particle.vy * 0.016;

				if (particle.opacity < 1 && particle.el.style.opacity === '0') {
					particle.opacity = 1;
				}
				particle.opacity -= 0.008;

				particle.el.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
				particle.el.style.opacity = particle.opacity;

				if (particle.opacity <= 0) {
					particle.el.remove();
				}
			});
		};

		gsap.ticker.add(tickerFunc);

		const tl = gsap.timeline({
			onComplete: () => {
				dispatch('complete');
			}
		});

		gsap.set(logo, { scale: 0, opacity: 0, rotation: -45 });

		tl.to(logo, {
			scale: 1,
			opacity: 1,
			rotation: 0,
			duration: 1.5,
			ease: 'elastic.out(1, 0.5)'
		});

		tl.to(
			logo,
			{
				scale: 1.1,
				duration: 0.4,
				yoyo: true,
				repeat: 1,
				ease: 'sine.inOut'
			},
			'-=0.5'
		);

		tl.to({}, { duration: 1.0 });

		// Animate container exit as well
		tl.to([logo, particlesContainer, container], {
			opacity: 0,
			scale: 1.1, // Less intense scale on root
			filter: 'blur(10px)',
			duration: 0.8,
			ease: 'power2.in'
		});
	});

	onDestroy(() => {
		if (tickerFunc) gsap.ticker.remove(tickerFunc);
	});
</script>

{#if loading}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-radial-premium"
		bind:this={container}
		out:fade={{ duration: 0 }}
	>
		<!-- duration 0 for Svelte fade because GSAP handles the visual exit, this is just for cleanup -->

		<div class="absolute inset-0 pointer-events-none" bind:this={particlesContainer} />

		<div class="relative z-10 flex flex-col items-center">
			<div
				class="p-8 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl relative"
			>
				<img
					src="/salati-app-icon.png"
					alt="Salati App"
					class="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
					bind:this={logo}
				/>
			</div>
		</div>
	</div>
{/if}

<style>
	.bg-radial-premium {
		background: radial-gradient(circle at center, #1a1a2e 0%, #050505 100%);
	}

	:global(.particle) {
		position: absolute;
		border-radius: 50%;
		pointer-events: none;
		will-change: transform, opacity;
	}
</style>
