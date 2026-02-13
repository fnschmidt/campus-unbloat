import { handleApiRequest } from '$lib/server/handleCdApiRequest';

export async function GET({ cookies }) {
	return handleApiRequest(cookies, 'get_examstats', 'Fehler bei der Ergebnisstatistik-Anfrage');
}
