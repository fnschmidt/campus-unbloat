import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function GET({ cookies }) {
	return handleApiRequest(cookies, 'get_examsignup', 'Fehler bei der Anmeldeoptionen-Anfrage');
}
