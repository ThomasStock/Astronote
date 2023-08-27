/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,svelte}'],
	theme: {
		extend: {
			opacity: {
				inactive: '38%',
				unfocused: '54%',
				focused: '87%'
			}
		}
	},
	plugins: []
};
