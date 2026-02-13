import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function POST({ request, cookies }) {
	const text = await request.text();

	return handleApiRequest(cookies, 'get_examdetails', 'Fehler beim Laden der Prüfungsdetails', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: text
	});
}
