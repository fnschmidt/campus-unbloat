import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { customCrimson } from './custom-crimson';

export default {
	darkMode: 'selector',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	safelist: [
		'translate-x-6',
		'translate-x-12',
		'translate-x-45',
		'translate-y-6',
		'translate-y-12',
		'translate-y-45',
		'rotate-6',
		'rotate-8',
		'rotate-12',
		'rotate-20'
	],
	theme: {
		extend: {
			maxHeight: {
				'safe-screen': 'calc(100dvh - 188px)',
				'safe-screen-with-header': 'calc(100dvh - 246px)' //assuming header is 58px incl. padding and stuff
			},
			backgroundImage: {
				'gradient-165': 'linear-gradient(165deg, var(--tw-gradient-stops))'
			}
		},
		screens: {
			sm: '480px',
			md: '640px',
			lg: '812px'
		}
	},
	plugins: [
		forms,
		skeleton({
			themes: {
				custom: [customCrimson]
			}
		}),
		function ({ addComponents }) {
			const opacities = [50, 60];
			const newComponents = {};

			opacities.forEach((opacity) => {
				newComponents[`.card-transparent-${opacity}`] = {
					[`@apply bg-white/${opacity} dark:bg-surface-700 shadow rounded-xl`]: {}
				};
			});

			addComponents(newComponents);
		}
	]
} satisfies Config;
