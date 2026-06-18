<script lang="ts">
	import Icon from '@iconify/svelte';
	import Node from './node.svelte';
	import { inEditMode } from './state/edit-mode.svelte.js';
	import NodeEditor from './node-editor.svelte';
	import { onMount } from 'svelte';
	import { persistence, nodesMap } from './state/document.js';
	import { useYjsMap } from './yjs.svelte.js';
	import { addSkill } from './state/skill.js';
	import { skillDraggable, GRID_SNAP } from './skill-draggable.js';

	let ready = $state(false);
	const nodes = useYjsMap(nodesMap);

	onMount(() => {
		if (!persistence) { ready = true; return; }
		if (persistence.synced) {
			ready = true;
		} else {
			persistence.once('synced', () => { ready = true; });
		}
	})

	function handleBackgroundClick(event: MouseEvent) {
		if (!inEditMode()) return;
		if (event.target !== event.currentTarget) return; // only clicks on the background itself

		const x = Math.round(event.offsetX / GRID_SNAP);
		const y = Math.round(event.offsetY / GRID_SNAP);
		addSkill(x, y);
	}
</script>

{#if ready}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="relative h-full w-full bg-[url(grid.png)] text-white"
		onclick={handleBackgroundClick}
	>
		{#each nodes.value.entries() as [id, node] (id)}
			{@const x = node.get('x')}
			{@const y = node.get('y')}
			{#if inEditMode()}
				<div
					class="absolute cursor-grab"
					style="left: {x * GRID_SNAP}px; top: {y * GRID_SNAP}px; transform: translate(-50%, -50%);"
					{@attach skillDraggable(node)}
				>
					<NodeEditor {node} />
				</div>
			{:else}
				<div 
					class="absolute"
					style="left: {x * GRID_SNAP}px; top: {y * GRID_SNAP}px; transform: translate(-50%, -50%);"
				>
					<Node {node} />
				</div>
			{/if}
		{/each}

		<svg class="pointer-events-none absolute inset-0 h-full w-full">
			<!-- edges will go here -->
		</svg>
	</div>

{:else}
	<div class="flex h-full items-center justify-center text-white">Loading...</div>
{/if}
