import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET({ cookies }) {
	const token = cookies.get('jwt');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const response = await fetch(`${env.CD_API_URL}/get_stundenplan`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error();
		}

		return response;
	} catch (error) {
		console.error('Error at stundenplan:');
		if (error instanceof Error) {
			console.error(error.message);
		}
		return new Response('CaDu: Stundenplan-Abfrage ist fehlgeschlagen', { status: 500 });
	}
}