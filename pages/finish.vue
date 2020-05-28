
<template>
	<section class="flex--column center-flex">
			<h1 v-if="actualGameState === 'playerLost'">You lost against the the pure Evil</h1>
			<h1 v-else>You successfully solved the adventure of RinQuest</h1>
		<nuxt-link
			to="/"
			tag="button"
			class="bg-transparent hover:bg-blue-400 text-blue-700 font-semibold hover:text-white py-2 px-4
			border border-blue-500 hover:border-transparent rounded"
		>
	Home
		</nuxt-link>
	</section>
</template>

<script>
export default {
	name: 'finishScreen',
	computed: {
		actualGameState() {
			return this.$store.state.gameState.actualState;
		},
	},
};
</script>

<style scoped>
h1{
	font-size: 2rem;
	font-weight: 600;
}
</style>
