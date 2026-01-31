import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Cache for prayer timings
let cachedPrayerTimings: any = null;
let prayerCacheTimestamp: number | null = null;
const PRAYER_CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in milliseconds (refresh hourly for accuracy)

// Location constants for Al Muharraq, Bahrain
const LOCATION = {
	city: 'Al Muharraq',
	country: 'Bahrain',
	latitude: 26.2572,
	longitude: 50.6089,
	method: 2, // Islamic Society of North America (ISNA) - You can change this
	// Available methods:
	// 1 = University of Islamic Sciences, Karachi
	// 2 = Islamic Society of North America (ISNA)
	// 3 = Muslim World League (MWL)
	// 4 = Umm al-Qura, Makkah
	// 5 = Egyptian General Authority of Survey
	// 7 = Institute of Geophysics, University of Tehran
	// 8 = Gulf Region
	// 9 = Kuwait
	// 10 = Qatar
	// 11 = Majlis Ugama Islam Singapura, Singapore
	// 12 = Union Organization islamic de France
	// 13 = Diyanet İşleri Başkanlığı, Turkey
	// 14 = Spiritual Administration of Muslims of Russia
	school: 1 // 0 = Shafi, 1 = Hanafi (for Asr calculation)
};

// Hijri months in Arabic
const HIJRI_MONTHS = [
	'محرم',
	'صفر',
	'ربيع الأول',
	'ربيع الآخر',
	'جمادى الأولى',
	'جمادى الآخرة',
	'رجب',
	'شعبان',
	'رمضان',
	'شوال',
	'ذو القعدة',
	'ذو الحجة'
];

interface AladhanTimings {
	Fajr: string;
	Sunrise: string;
	Dhuhr: string;
	Asr: string;
	Maghrib: string;
	Isha: string;
	Sunset: string;
	[key: string]: string;
}

interface AladhanDate {
	hijri: {
		day: string;
		month: {
			number: number;
			en: string;
			ar: string;
		};
		year: string;
		designation: {
			abbreviated: string;
			expanded: string;
		};
	};
	gregorian: {
		date: string;
		day: string;
		month: {
			number: number;
			en: string;
		};
		year: string;
	};
}

interface AladhanResponse {
	code: number;
	status: string;
	data: {
		timings: AladhanTimings;
		date: AladhanDate;
		meta: {
			latitude: number;
			longitude: number;
			timezone: string;
			method: {
				id: number;
				name: string;
			};
			school: {
				name: string;
			};
		};
	};
}

// Function to fetch prayer timings from Aladhan API
async function fetchPrayerTimings() {
	try {
		// Get current date
		const now = new Date();
		const timestamp = Math.floor(now.getTime() / 1000);

		// Construct API URL with all parameters
		const apiUrl = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&method=${LOCATION.method}&school=${LOCATION.school}`;

		console.log('Fetching prayer times from Aladhan API:', apiUrl);

		const response = await fetch(apiUrl, {
			headers: {
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: AladhanResponse = await response.json();

		if (data.code !== 200 || !data.data) {
			throw new Error('Invalid response from Aladhan API');
		}

		// Extract timings and convert to 12-hour format
		const timings = data.data.timings;
		const date = data.data.date;

		// Convert 24-hour time to 12-hour format with AM/PM
		const convertTo12Hour = (time24: string): string => {
			// Remove any timezone info (e.g., "(+03)" at the end)
			const cleanTime = time24.split(' ')[0];
			const [hours, minutes] = cleanTime.split(':').map(Number);

			const period = hours >= 12 ? 'PM' : 'AM';
			const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

			return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
		};

		// Format prayer times
		const formattedTimings: Record<string, string> = {
			fajr: convertTo12Hour(timings.Fajr),
			sunrise: convertTo12Hour(timings.Sunrise),
			dhuhr: convertTo12Hour(timings.Dhuhr),
			asr: convertTo12Hour(timings.Asr),
			maghrib: convertTo12Hour(timings.Maghrib),
			isha: convertTo12Hour(timings.Isha)
		};

		// Format Hijri date
		const hijriDay = date.hijri.day;
		const hijriMonth = HIJRI_MONTHS[date.hijri.month.number - 1];
		const hijriYear = date.hijri.year;
		const hijriDate = `${hijriDay} ${hijriMonth} ${hijriYear}هـ`;

		// Calculate next prayer
		const currentTime = now.getHours() * 60 + now.getMinutes();
		const prayerOrder = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

		let nextPrayer = null;
		for (const prayer of prayerOrder) {
			if (formattedTimings[prayer]) {
				const [time, modifier] = formattedTimings[prayer].split(' ');
				let [hours, minutes] = time.split(':').map(Number);

				if (modifier && modifier.toLowerCase() === 'pm' && hours !== 12) {
					hours += 12;
				} else if (modifier && modifier.toLowerCase() === 'am' && hours === 12) {
					hours = 0;
				}

				const prayerMinutes = hours * 60 + minutes;

				if (prayerMinutes > currentTime) {
					nextPrayer = {
						name: prayer.charAt(0).toUpperCase() + prayer.slice(1),
						time: formattedTimings[prayer],
						countdown: calculateCountdown(currentTime, prayerMinutes)
					};
					break;
				}
			}
		}

		// If no next prayer found (meaning current time is past all prayers), use first prayer of next day
		if (!nextPrayer) {
			const firstPrayer = prayerOrder[0];
			if (formattedTimings[firstPrayer]) {
				nextPrayer = {
					name: firstPrayer.charAt(0).toUpperCase() + firstPrayer.slice(1),
					time: formattedTimings[firstPrayer],
					countdown: calculateCountdown(currentTime, 24 * 60) // Add 24 hours
				};
			}
		}

		return {
			location: `${LOCATION.city}, ${LOCATION.country}`,
			date: date.gregorian.date,
			timings: formattedTimings,
			nextPrayer,
			hijriDate,
			meta: {
				timezone: data.data.meta.timezone,
				method: data.data.meta.method.name,
				school: data.data.meta.school.name,
				latitude: LOCATION.latitude,
				longitude: LOCATION.longitude
			}
		};
	} catch (error) {
		console.error('Error fetching prayer timings from Aladhan API:', error);
		throw error;
	}
}

// Helper function to calculate countdown time
function calculateCountdown(currentMinutes: number, targetMinutes: number): string {
	let diffMinutes = targetMinutes - currentMinutes;

	// Handle case where target is next day
	if (diffMinutes < 0) {
		diffMinutes += 24 * 60;
	}

	const hours = Math.floor(diffMinutes / 60);
	const minutes = diffMinutes % 60;
	const seconds = 0; // Placeholder, will be calculated on client side

	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
}

export const GET: RequestHandler = async () => {
	try {
		const now = Date.now();

		// Check if we have valid cached data (less than 1 hour old)
		if (
			cachedPrayerTimings &&
			prayerCacheTimestamp &&
			now - prayerCacheTimestamp < PRAYER_CACHE_DURATION
		) {
			console.log('Returning cached prayer timings (age:', Math.floor((now - prayerCacheTimestamp) / 1000 / 60), 'minutes)');
			return json({
				prayerTimings: cachedPrayerTimings,
				cached: true,
				cacheAge: Math.floor((now - prayerCacheTimestamp) / 1000 / 60)
			});
		}

		// Fetch new data
		console.log('Fetching fresh prayer timings from Aladhan API');
		const prayerTimings = await fetchPrayerTimings();

		// Update cache
		cachedPrayerTimings = prayerTimings;
		prayerCacheTimestamp = now;

		console.log('Successfully fetched prayer timings:', {
			location: prayerTimings.location,
			date: prayerTimings.date,
			nextPrayer: prayerTimings.nextPrayer?.name
		});

		return json({
			prayerTimings,
			cached: false
		});
	} catch (error) {
		console.error('Error in prayer timings API:', error);

		// If we have cached data, return it even if expired
		if (cachedPrayerTimings) {
			console.warn('Returning expired cached data due to API error');
			return json({
				prayerTimings: cachedPrayerTimings,
				cached: true,
				error: 'Using cached data due to API error'
			});
		}

		return json(
			{
				error: 'Failed to fetch prayer timings',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
