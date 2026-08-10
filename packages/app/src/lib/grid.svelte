<script lang="ts">
	import Node from './node.svelte';
	import { inEditMode } from './state/edit-mode.svelte.js';
	import NodeEditor from './node-editor.svelte';
	import { onMount } from 'svelte';
	import { persistence, nodesMap, edgesMap } from './state/document.js';
	import { useYjsMap } from './yjs.svelte.js';
	import { addSkill } from './state/skill.js';
	import { addEdge } from './state/edge.js';
	import { connectedEdges } from './types/edge.js';
	import { asNodeId } from './types/ids.js';
	import { getField } from './types/skill.js';
	import { skillDraggable, GRID_SNAP } from './skill-draggable.js';
	import GridEdges from './grid-edges.svelte';
	import ConnectionPreview from './connection-preview.svelte';
	import {
		connectionDrag,
		updateConnectionPreview,
		finishConnectionDrag,
		cancelConnectionDrag
	} from './state/connection-drag.svelte.js';
	import { getSkillIdFromElement } from './grid-coords.js';
	import type { ToolId } from './toolbox.svelte';

	let { activeTool }: { activeTool: ToolId } = $props();

	let ready = $state(false);
	let gridEl = $state<HTMLDivElement | null>(null);
	let suppressBackgroundClick = false; // Don't create a new skill when dragging the grid
	const nodes = useYjsMap(nodesMap);
	const edges = useYjsMap(edgesMap);

	onMount(() => {
		const suppressClick = () => {
			suppressBackgroundClick = true;
		};
		window.addEventListener('skillmap:panstart', suppressClick);
		window.addEventListener('skillmap:skilldragstart', suppressClick);

		if (!persistence) {
			ready = true;
		} else if (persistence.synced) {
			ready = true;
		} else {
			persistence.once('synced', () => { ready = true; });
		}

		return () => {
			window.removeEventListener('skillmap:panstart', suppressClick);
			window.removeEventListener('skillmap:skilldragstart', suppressClick);
		};
	});

	$effect(() => {
		if (!connectionDrag.fromId) return;

		function handlePointerMove(event: PointerEvent) {
			if (!gridEl) return;
			updateConnectionPreview(event.clientX, event.clientY, gridEl);
		}

		function handlePointerUp(event: PointerEvent) {
			const fromId = finishConnectionDrag();
			if (!fromId) return;

			const toId = getSkillIdFromElement(event.target as Element);
			if (toId && toId !== fromId) {
				addEdge(fromId, toId);
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				cancelConnectionDrag();
			}
		}

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerup', handlePointerUp);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	function handleBackgroundClick(event: MouseEvent) {
		if (inEditMode() && activeTool == 'add-skill') {
			if (suppressBackgroundClick) {
				suppressBackgroundClick = false;
				return;
			}

			const x = Math.round(event.offsetX / GRID_SNAP);
			const y = Math.round(event.offsetY / GRID_SNAP);
			addSkill(x, y);
		}
	}

	// Skip edges left pointing at a node that another peer deleted.
	const visibleEdges = $derived(
		connectedEdges(edges.value, new Set([...nodes.value.keys()].map(asNodeId)))
	);
</script>

{#if ready}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		bind:this={gridEl}
		class='relative h-full w-full text-white'
		onclick={handleBackgroundClick}
	>
		<GridEdges {gridEl} edges={visibleEdges} editMode={inEditMode()} {activeTool} />

		{#each nodes.value.entries() as [id, node] (id)}
			{@const x = getField(node, 'x')}
			{@const y = getField(node, 'y')}
			{#if inEditMode()}
				<div
					data-skill-id={id}
					class="absolute cursor-grab"
					style="left: {x * GRID_SNAP}px; top: {y * GRID_SNAP}px; transform: translate(-50%, -50%);"
					{@attach skillDraggable(node)}
				>
					<NodeEditor {node} {activeTool} />
				</div>
			{:else}
				<div
					data-skill-id={id}
					class="absolute"
					style="left: {x * GRID_SNAP}px; top: {y * GRID_SNAP}px; transform: translate(-50%, -50%);"
				>
					<Node {node} />
				</div>
			{/if}
		{/each}

		<ConnectionPreview {gridEl} />
	</div>
{:else}
	<div class="flex h-full items-center justify-center text-white">Loading...</div>
{/if}
