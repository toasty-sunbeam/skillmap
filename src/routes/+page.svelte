<script lang="ts">
	import Grid from '$lib/grid.svelte';
    import Zoom from '$lib/zoom.svelte';
</script>

<h1 class="text-xl text-center">Talent tree</h1>

<main class="h-[calc(100vh-4rem)] overflow-hidden">
	<Zoom>
		<Grid />
	</Zoom>
</main>