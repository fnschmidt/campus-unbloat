import { handleApiRequest } from '$lib/server/handleMensaApiRequest';

export async function GET() {
	return handleApiRequest('canteens', 'Fehler bei der Mensalisten-Anfrage');
}
