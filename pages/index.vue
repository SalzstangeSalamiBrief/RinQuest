
<template>
	<section class="flex--column center-flex">
		<img width="512" src="/rinQuest_Title.svg">
		<nuxt-link
			to="/game"
			tag="button"
			class="bg-transparent hover:bg-blue-400 text-blue-700 font-semibold hover:text-white py-2 px-4
				border border-blue-500 hover:border-transparent rounded"
		>
			Start Game
		</nuxt-link>
			<nuxt-link
			to="/help"
			tag="button"
			class="bg-transparent hover:bg-blue-400 text-blue-700 font-semibold hover:text-white py-2 px-4
				border border-blue-500 hover:border-transparent rounded"
		>
			Help
		</nuxt-link>
		<button
			class="bg-transparent hover:bg-red-500 text-gray-700
				font-semibold hover:text-white py-2 px-4
				border border-gray-500 hover:border-transparent rounded"
			@click="closeApp"
		>
			Quit
		</button>
	</section>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';

export default {
	methods: {
		closeApp() {
			remote.getCurrentWindow().close();
		},
	},
};
</script>

<style scoped>
	section * {
		margin: 1rem 0;
	}
</style>
