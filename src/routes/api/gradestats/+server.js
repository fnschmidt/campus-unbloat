import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function POST({ request, cookies }) {
	const text = await request.text();

	return handleApiRequest(cookies, 'get_gradestats', 'Fehler beim Laden der Ergebnisstatistik', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: text
	});
}
