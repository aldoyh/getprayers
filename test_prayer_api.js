import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testPrayerTimesAPI() {
    console.log('🕌 Testing Prayer Times API...\n');

    try {
        // Test the API endpoint
        const apiUrl = 'http://localhost:5173/api/islamic-data/prayer-times';
        console.log(`📡 Fetching from: ${apiUrl}\n`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('✅ API Response received!\n');
        console.log('📍 Location:', data.prayerTimings.location);
        console.log('📅 Date:', data.prayerTimings.date);
        console.log('🌙 Hijri Date:', data.prayerTimings.hijriDate);
        console.log('💾 Cached:', data.cached || false);

        if (data.cacheAge) {
            console.log('⏱️  Cache Age:', data.cacheAge, 'minutes');
        }

        console.log('\n📿 Prayer Times:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const prayerNames = {
            fajr: 'الفجر (Fajr)',
            sunrise: 'الشروق (Sunrise)',
            dhuhr: 'الظهر (Dhuhr)',
            asr: 'العصر (Asr)',
            maghrib: 'المغرب (Maghrib)',
            isha: 'العشاء (Isha)'
        };

        for (const [key, name] of Object.entries(prayerNames)) {
            if (data.prayerTimings.timings[key]) {
                const isNext = data.prayerTimings.nextPrayer?.name.toLowerCase() === key;
                const marker = isNext ? '⏰' : '  ';
                console.log(`${marker} ${name.padEnd(20)} ${data.prayerTimings.timings[key]}`);
            }
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (data.prayerTimings.nextPrayer) {
            console.log('\n🔔 Next Prayer:');
            console.log(`   ${data.prayerTimings.nextPrayer.name} at ${data.prayerTimings.nextPrayer.time}`);
            console.log(`   Countdown: ${data.prayerTimings.nextPrayer.countdown}`);
        }

        if (data.prayerTimings.meta) {
            console.log('\n⚙️  Calculation Settings:');
            console.log(`   Method: ${data.prayerTimings.meta.method}`);
            console.log(`   School: ${data.prayerTimings.meta.school}`);
            console.log(`   Timezone: ${data.prayerTimings.meta.timezone}`);
            console.log(`   Coordinates: ${data.prayerTimings.meta.latitude}, ${data.prayerTimings.meta.longitude}`);
        }

        console.log('\n✨ Test completed successfully!\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('\nMake sure the dev server is running:');
        console.error('  npm run dev\n');
        process.exit(1);
    }
}

// Run the test
testPrayerTimesAPI();
