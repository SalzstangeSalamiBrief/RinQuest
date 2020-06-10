<template>
	<section class="help-container">
		<h1 class="text-gray-600">Help</h1>
		<div class="htp-container">
			<h2 class="text-gray-600">How to Play</h2>
			<div>cool description</div>
		</div>
		<div class="controls-container">
			<h2 class="text-gray-600">Controls</h2>
			<div>
				<p>Press one of the listed keys to trigger the corresponding action:</p>
				<div role="table" class="table">
					<div
						v-for="controlKey in controls"
						:key="controlKey"
						role="rowgroup"
						class="row-group"
					>
						<div role="row" class="controlKey-row flex--row center-flex">
							<span role="cell" class="flex-row center-flex">{{ controlKey.key }}</span>
							<span role="cell">{{ controlKey.description }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex--row center-flex">
			<nuxt-link
			to="/"
			tag="button"
			class="bg-transparent hover:bg-blue-400 text-blue-700 font-semibold hover:text-white py-2 px-4
			border border-blue-500 hover:border-transparent rounded"
		>
			Main Menu
			</nuxt-link>
		</div>
	</section>
</template>
<script>
export default {
	name: 'help',
	data: () => ({
		controls: [
			{
				key: 'W',
				description: 'Move your character to the top',
			},
			{
				key: 'A',
				description: 'Move move your character to the left',
			},
			{
				key: 'S',
				description: 'Move your character to the bottom',
			},
			{
				key: 'D',
				description: 'Move your character to the right',
			},
			{
				key: 'Space',
				description: 'Attack with your figure',
			},
		],
	}),
};
</script>
<style scoped>
.help-container{
	width: 60%;
}
 h1{
	font-size: 2rem;
	font-weight: 700;
 }
 h2{
	font-size: 1.5rem;
	font-weight: 600;
 }

 .htp-container,
 .controls-container{
	margin: 1rem 0;
 }
 button{
	margin-top: 2rem;
 }
 .row-group,
 .table{
	width: 100%;
 }
 .controlKey-row{
	margin: .25rem 0;
	width: 100%;
 }
 .controlKey-row span:first-child{
	display: inline-block;
	width: 15%;
	text-align: center;
 }
  .controlKey-row span:last-child{
	width: 35%;
 }
 .table{
	margin: auto;
 }
</style>
