import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function GET({ cookies }) {
	return handleApiRequest(cookies, 'get_timeline', 'Fehler bei der Blockplan-Anfrage');
}
