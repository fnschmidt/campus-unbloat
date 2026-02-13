import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function POST({ request, cookies }) {
	const text = await request.text();

	return handleApiRequest(cookies, 'cancelexam', 'Fehler bei der Prüfungsabmeldung', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: text
	});
}
