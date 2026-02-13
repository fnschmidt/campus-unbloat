import { env } from '$env/dynamic/private';

/**
 * Handles API requests by forwarding them to the external API.
 * @param {string} endpoint - The Mensa-API endpoint to call
 * @param {string} error_message - Name of the endpoint displayed in a toast notification if an error occured
 * @returns {Promise<Response>} - The response from the external API or an error response
 */
export async function handleApiRequest(endpoint, error_message) {
	try {
		const response = await fetch(`${env.MENSA_API_URL}/${endpoint}`);

		if (!response.ok) {
			throw new Error();
		}

		return response;
	} catch (error) {
		console.error('Error at mensa/', endpoint);
		if (error instanceof Error) {
			console.error(error.message);
		}
		return new Response(`${error_message}`, { status: 500 });
	}
}
