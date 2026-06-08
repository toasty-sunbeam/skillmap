<script lang="ts">
	import Icon from '@iconify/svelte';
	import Node from './node.svelte';
</script>

<div class="h-full w-full bg-[url(grid.png)] text-white"> <!-- Background image -->
	<div>
		<Icon icon="ph:graduation-cap-bold" />
		<Icon icon="game-icons:anvil" />
		<Node />
	</div>
	<svg></svg> <!-- Edges -->
</div>