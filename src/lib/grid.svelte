<script lang="ts">
	import Icon from '@iconify/svelte';
	import Node from './node.svelte';
	import { inEditMode } from './state/edit-mode.svelte.js';
	import NodeEditor from './node-editor.svelte';
</script>

<div class="h-full w-full bg-[url(grid.png)] text-white"> <!-- Background image -->
	<div>
		<Icon icon="ph:graduation-cap-bold" />
		<Icon icon="game-icons:anvil" />
		{#if inEditMode()}
			<NodeEditor/>
		{:else}
			<Node/>
		{/if}
	</div>
	<svg></svg> <!-- Edges -->
</div>