import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function GET({ cookies }) {
	return handleApiRequest(cookies, 'get_examverfahren', 'Fehler bei der Abmeldeoptionen-Anfrage');
}
