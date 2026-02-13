import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function POST({ request, cookies }) {
	const text = await request.text();

	return handleApiRequest(cookies, 'registerexam', 'Fehler bei der Prüfungsanmeldung', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: text
	});
}
