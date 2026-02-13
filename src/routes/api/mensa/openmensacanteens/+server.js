import { handleApiRequest } from '$lib/server/handleMensaApiRequest';

export async function GET() {
	return handleApiRequest('openmensacanteens', 'Fehler bei der OpenMensa-Listen-Anfrage');
}
