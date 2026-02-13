import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * Handles API requests by forwarding them to the external API.
 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit cookies object
 * @param {string} endpoint - The Campus-API endpoint to call
 * @param {string} error_message - Name of the endpoint displayed in a toast notification if an error occured
 * @param {RequestInit} options - Additional fetch options (method, headers, body, etc.)
 * @returns {Promise<Response>} - The response from the external API or an error response
 */
export async function handleApiRequest(cookies, endpoint, error_message, options = {}) {
	const token = cookies.get('jwt');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		options.headers = {
			Authorization: `Bearer ${token}`,
			...(options.headers ?? {})
		};

		const response = await fetch(`${env.CD_API_URL}/${endpoint}`, options);

		if (!response.ok) {
			if (response.status === 429) {
				throw new ReferenceError();
			}
			throw new Error();
		}

		return response;
	} catch (error) {
		if (error instanceof ReferenceError) {
			return new Response('Zu viele Anfragen', { status: 429 });
		}

		console.error('Error at cd/', endpoint);
		if (error instanceof Error) {
			console.error(error.message);
		}
		return new Response(`${error_message}`, { status: 500 });
	}
}
