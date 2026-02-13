import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function GET({ cookies }) {
	return handleApiRequest(cookies, 'get_fachsem', 'Fehler bei der Fachsemester-Anfrage');
}
