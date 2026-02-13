import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function GET({ cookies }) {
	return handleApiRequest(cookies, 'get_reminders', 'Fehler bei der Erinnerungen-Anfrage');
}
