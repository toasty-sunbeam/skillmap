<script lang="ts">
	import type { Edge, EdgeLine } from './types/edge.js';
	import { edgeKey } from './types/edge.js';
	import { getNodeCenter } from './grid-coords.js';
	import { removeEdge } from './state/edge.js';
	import type { ToolId } from './toolbox.svelte';

	let {
		gridEl,
		edges,
		editMode = false,
		activeTool,
	}: {
		gridEl: HTMLElement | null;
		edges: Edge[];
		editMode?: boolean;
		activeTool: ToolId;
	} = $props();

	const connectMode = $derived(editMode && activeTool === 'connect-skills');

	let tick = $state(0);

	$effect(() => {
		/** Update linePositions and previewLine... */
		const bump = () => {
			tick++;
		};
		/** ...on skillmap:panzoom custom event */
		window.addEventListener('skillmap:panzoom', bump);
		return () => window.removeEventListener('skillmap:panzoom', bump);
	});

	const linePositions = $derived.by(() => {
		tick;
		if (!gridEl) return [];

		return edges
			.map((edge) => {
				const from = getNodeCenter(edge.from, gridEl);
				const to = getNodeCenter(edge.to, gridEl);
				if (!from || !to) return null;
				return { key: edgeKey(edge), from, to, edge };
			})
			.filter((line): line is EdgeLine => line !== null);
	});

	function handleDelete(edge: Edge) {
		removeEdge(edge.from, edge.to);
	}

	function handleDeleteKeydown(edge: Edge, event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.stopPropagation();
			handleDelete(edge);
		}
	}
</script>

<svg class={['absolute inset-0 h-full w-full', !connectMode && 'pointer-events-none']}>
	{#each linePositions as line (line.key)}
		<g class={connectMode ? 'group/edge' : undefined}>
			<line
				x1={line.from.x}
				y1={line.from.y}
				x2={line.to.x}
				y2={line.to.y}
				stroke="currentColor"
				stroke-width="2"
				class={['pointer-events-none', connectMode ? 'text-gray-500 group-hover/edge:text-red-400' : 'text-gray-500']}
			/>
			{#if connectMode}
				<line
					data-edge-hit
					role="button"
					aria-label="Delete connection"
					tabindex="0"
					x1={line.from.x}
					y1={line.from.y}
					x2={line.to.x}
					y2={line.to.y}
					stroke="transparent"
					stroke-width="16"
					class="cursor-pointer"
					onclick={(event) => { event.stopPropagation(); handleDelete(line.edge); }}
					onkeydown={(event) => handleDeleteKeydown(line.edge, event)}
					onpointerdown={(event) => event.stopPropagation()}
				/>
			{/if}
		</g>
	{/each}
</svg>
