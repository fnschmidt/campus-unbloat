import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');

		const response = await fetch(`${import.meta.env.VITE_API_URL}/signin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		});

		if (!response.ok) {
			return fail(401, {
				message: 'Nutzer/Passwort ungültig'
			});
		} else {
			const responseData = await response.json();

			cookies.set('jwt', responseData.token, {
				path: '/',
				sameSite: 'strict',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production'
			});

			cookies.set('user_basic', JSON.stringify(responseData.user), {
				path: '/',
				sameSite: 'strict',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production'
			});

			throw redirect(303, '/dashboard');
		}
	}
};
