<script lang="ts">
	let { points, maxPoints }: { points: number; maxPoints: number } = $props();

	const inactivePoints = $derived(maxPoints - points);
</script>

<style>
	.dot {
		background: silver;
		width: 7px;
		height: 7px;
		border-radius: 100%;
	}
	.inactive.dot {
		background: silver;
	}
	.active.dot {
		background: greenyellow;
	}
</style>

<div class="sr-only">{points} of {maxPoints} points</div>
<div class="flex flex-row gap-0.5">
	{#each { length: points }, i}
		<div class="active dot"></div>
	{/each}
	{#each { length: inactivePoints }, j}
		<div class="inactive dot"></div>
	{/each}
</div>
