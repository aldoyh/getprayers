import { json } from '@sveltejs/kit';

// OMDB has been removed - this endpoint now returns a placeholder
export async function POST({ request }: { request: any }) {
	const { title } = await request.json();

	// Return empty placeholder data since OMDB is no longer used
	return json({
		Title: title,
		Year: '',
		Poster: '',
		Plot: '',
		Actors: '',
		Rated: ''
	});
}
