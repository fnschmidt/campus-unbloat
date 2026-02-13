import { handleApiRequest } from '$lib/server/handleMensaApiRequest';

export async function GET({ params }) {
	const { canteen, date } = params;

	return handleApiRequest(`canteens/${canteen}/days/${date}`, 'Fehler bei der Mensa-Anfrage');
}
