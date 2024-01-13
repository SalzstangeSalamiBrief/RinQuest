/* eslint-disable */
module.exports = {
	mode: 'spa',
	head: { title: 'rin-quest' }, // Headers of the page
	loading: false, // Disable default loading bar
	build: {
		extend(config, { isDev, isClient }) {
			if (isDev && isClient) {
				// Run ESLint on save
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/,
				});
			}
			// Extend only webpack config for client-bundle
			if (isClient) { config.target = 'electron-renderer'; }
		},
	},
	buildModules: ['@nuxtjs/tailwindcss'],
	dev: process.env.NODE_ENV === 'DEV',
	css: [
		'@/assets/css/global.css',
	],
};