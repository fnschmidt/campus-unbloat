import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function GET({ cookies }) {
	return handleApiRequest(cookies, 'get_grades', 'Fehler bei der Noten-Anfrage');
}
