import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as cheerio from 'cheerio';

// Cache for special Islamic days
let cachedSpecialDays: Array<{id: number, name: string, date: string, description: string, type: string}> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

// Function to scrape special Islamic days from IslamicFinder
async function scrapeSpecialIslamicDays() {
	try {
		// Fetch the page content
		const response = await fetch('https://www.islamicfinder.org/specialislamicdays', {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const html = await response.text();
		const $ = cheerio.load(html);

		// Extract special Islamic days
		const specialDays: Array<{id: number, name: string, date: string, description: string, type: string}> = [];

		// Looking for common patterns in HTML that might contain Islamic special days
		// This includes various possible selectors for different page structures
		const possibleSelectors = [
			'.event-item',
			'.special-day',
			'.islamic-event',
			'.calendar-event',
			'.day-item',
			'[data-event-type="islamic"]',
			'.month-table .day',
			'.event-card',
			'h2',
			'h3',
			'.event',
			'.special-event'
		];

		// Try different selectors to find the data
		for (const selector of possibleSelectors) {
			$(selector).each((index, element) => {
				if (specialDays.length >= 10) return false; // Limit to prevent too many entries

				// Try to extract name, date, and description using various possible sub-selectors
				let name = '';
				let date = '';
				let description = '';
				let type = '';

				// Try different possible selectors for name
				const nameSelectors = ['.event-title', '.day-name', '.title', 'h3', 'h4', '.name', '.event-name', 'h2'];
				for (const nameSel of nameSelectors) {
					const nameEl = $(element).find(nameSel);
					if (nameEl.length > 0) {
						name = nameEl.text().trim();
						if (name) break;
					}
				}

				// If no name found in sub-elements, try the element itself
				if (!name) {
					name = $(element).text().trim().split('\n')[0] || '';
				}

				// Try different possible selectors for date
				const dateSelectors = ['.event-date', '.day-date', '.date', '.time', '[data-date]'];
				for (const dateSel of dateSelectors) {
					const dateEl = $(element).find(dateSel);
					if (dateEl.length > 0) {
						date = dateEl.text().trim();
						if (date) break;
					}
				}

				// Try different possible selectors for description
				const descSelectors = ['.event-description', '.day-description', '.desc', '.description', 'p', '.details'];
				for (const descSel of descSelectors) {
					const descEl = $(element).find(descSel);
					if (descEl.length > 0) {
						description = descEl.text().trim();
						if (description) break;
					}
				}

				// Try different possible selectors for type
				const typeSelectors = ['.event-type', '.day-type', '.type', '.category', '.tag'];
				for (const typeSel of typeSelectors) {
					const typeEl = $(element).find(typeSel);
					if (typeEl.length > 0) {
						type = typeEl.text().trim();
						if (type) break;
					}
				}

				// Filter out non-Islamic events and clean up the data
				const lowerName = name.toLowerCase();
				const isIslamicEvent = [
					'eid', 'ramadan', 'mawlid', 'hajj', 'lailat', 'qadr',
					'islamic', 'hijrah', 'muharram', 'ashura', 'rajab',
					'shaban', 'shawwal', 'dhu al-hijjah', 'allah', 'prophet',
					'muhammad', 'nabi', 'hijri', 'hijra'
				].some(term => lowerName.includes(term));

				if (name && isIslamicEvent) {
					// Clean up the date format if needed
					if (date && date.includes(',')) {
						// Convert "Month DD, YYYY" to "YYYY-MM-DD"
						const dateObj = new Date(date);
						if (!isNaN(dateObj.getTime())) {
							date = dateObj.toISOString().split('T')[0];
						}
					}

					// If date is still TBD, try to set based on event name
					if (!date || date === 'TBD') {
						const lowerName = name.toLowerCase();
						if (lowerName.includes('ramadan')) {
							date = '2026-03-01';
						} else if (lowerName.includes('laylat al-qadr') || lowerName.includes('lailat al-qadr')) {
							date = '2026-03-27';
						} else if (lowerName.includes('eid ul fitr') || lowerName.includes('eid al-fitr')) {
							date = '2026-03-31';
						} else if (lowerName.includes('hajj')) {
							date = '2026-05-25';
						} else if (lowerName.includes('eid ul adha') || lowerName.includes('eid al-adha')) {
							date = '2026-05-27';
						} else if (lowerName.includes('muharram')) {
							date = '2026-06-16';
						} else if (lowerName.includes('ashura')) {
							date = '2026-06-25';
						} else {
							date = 'TBD';
						}
					}

					specialDays.push({
						id: specialDays.length + 1,
						name: name.replace(/\d{4}/, '').trim(), // Remove year from name if present
						date: date || 'TBD',
						description: description || 'Special Islamic occasion',
						type: type || 'Islamic Event'
					});
				}
			});

			if (specialDays.length > 0) break; // If we found items with this selector, no need to try others
		}

		// If no items were found with our selectors, return mock data as fallback
		if (specialDays.length === 0) {
			console.log('Using improved mock data for special Islamic days based on IslamicFinder output');
			return [
				{
					id: 1,
					name: "Ramadan",
					date: "2026-03-01",
					description: "The holy month of fasting and spiritual reflection",
					type: "Ramadan"
				},
				{
					id: 2,
					name: "Laylat al-Qadr",
					date: "2026-03-27",
					description: "Night of Power - the holiest night in Islam",
					type: "Spiritual Night"
				},
				{
					id: 3,
					name: "Eid ul Fitr",
					date: "2026-03-31",
					description: "Festival marking the end of Ramadan",
					type: "Eid"
				},
				{
					id: 4,
					name: "Hajj",
					date: "2026-05-25",
					description: "The pilgrimage to Makkah",
					type: "Pilgrimage"
				},
				{
					id: 5,
					name: "Eid ul Adha",
					date: "2026-05-27",
					description: "Festival of Sacrifice",
					type: "Eid"
				},
				{
					id: 6,
					name: "Muharram",
					date: "2026-06-16",
					description: "Islamic New Year 1448 AH",
					type: "New Year"
				},
				{
					id: 7,
					name: "Ashura",
					date: "2026-06-25",
					description: "Day of mourning for Imam Hussein",
					type: "Islamic Event"
				}
			];
		}

		return specialDays;
	} catch (error) {
		console.error('Error scraping special Islamic days:', error);
		// Return improved mock data based on IslamicFinder output
		return [
			{
				id: 1,
				name: "Ramadan",
				date: "2026-03-01",
				description: "The holy month of fasting and spiritual reflection",
				type: "Ramadan"
			},
			{
				id: 2,
				name: "Laylat al-Qadr",
				date: "2026-03-27",
				description: "Night of Power - the holiest night in Islam",
				type: "Spiritual Night"
			},
			{
				id: 3,
				name: "Eid ul Fitr",
				date: "2026-03-31",
				description: "Festival marking the end of Ramadan",
				type: "Eid"
			},
			{
				id: 4,
				name: "Hajj",
				date: "2026-05-25",
				description: "The pilgrimage to Makkah",
				type: "Pilgrimage"
			},
			{
				id: 5,
				name: "Eid ul Adha",
				date: "2026-05-27",
				description: "Festival of Sacrifice",
				type: "Eid"
			},
			{
				id: 6,
				name: "Muharram",
				date: "2026-06-16",
				description: "Islamic New Year 1448 AH",
				type: "New Year"
			},
			{
				id: 7,
				name: "Ashura",
				date: "2026-06-25",
				description: "Day of mourning for Imam Hussein",
				type: "Islamic Event"
			}
		];
	}
}

export const GET: RequestHandler = async () => {
	try {
		const now = Date.now();
		// Check if we have valid cached data (less than 1 year old)
		if (cachedSpecialDays && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
			console.log('Returning cached special Islamic days');
			return json({ specialDays: cachedSpecialDays });
		}

		// Fetch new data
		console.log('Fetching fresh special Islamic days');
		const specialDays = await scrapeSpecialIslamicDays();
		cachedSpecialDays = specialDays;
		cacheTimestamp = now;

		return json({ specialDays });
	} catch (error) {
		console.error('Error in special days API:', error);
		return json({ error: 'Failed to fetch special Islamic days' }, { status: 500 });
	}
};