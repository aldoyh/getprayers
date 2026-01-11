<script lang="ts">
    import { fade } from 'svelte/transition';
</script>

<footer class="border-t border-[#d4af37]/20 bg-[#0d0d14]/80 backdrop-blur-sm mt-16">
    <div class="max-w-6xl mx-auto w-full px-6 py-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
            <!-- Left Side - Branding -->
            <div class="text-center md:text-right">
                <div class="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <svg class="w-8 h-8 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/>
                    </svg>
                    <span class="text-2xl font-bold text-[#d4af37]">تطبيق الصلاة</span>
                </div>
                <p class="text-[#6a6a7a] text-sm">
                    مواقيت الصلاة والمناسبات الإسلامية
                </p>
            </div>

            <!-- Center - Verse -->
            <div class="text-center max-w-md">
                <p class="text-[#a0a0b0] text-lg leading-relaxed">
                    ﴿ وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ ﴾
                </p>
                <p class="text-[#6a6a7a] text-xs mt-2">سورة البقرة</p>
            </div>

            <!-- Right Side - Links -->
            <div class="flex flex-col items-center md:items-end gap-4">
                <div class="flex items-center gap-4">
                    <a 
                        href="https://github.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-10 h-10 rounded-full bg-[#1a1a24] border border-[#d4af37]/20 flex items-center justify-center text-[#a0a0b0] hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all"
                        aria-label="GitHub"
                    >
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                    <a 
                        href="https://twitter.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-10 h-10 rounded-full bg-[#1a1a24] border border-[#d4af37]/20 flex items-center justify-center text-[#a0a0b0] hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-all"
                        aria-label="Twitter"
                    >
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>
                </div>
                <p class="text-[#6a6a7a] text-xs mb-2">
                    في ثواب المرحوم الحاج الأستاذ / عيسى بن حسن بن أحمد الدوي
                </p>
                <p class="text-[#6a6a7a] text-xs">
                    © {new Date().getFullYear()} جميع الحقوق محفوظة
                </p>
            </div>
        </div>
    </div>
</footer>
