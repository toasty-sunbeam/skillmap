<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Edge, EdgeLine } from './types/edge.js';
	import { edgeKey } from './types/edge.js';
	import { getNodeCenter } from './grid-coords.js';
	import { removeEdge } from './state/edge.js';

	let {
		gridEl,
		edges,
		editMode = false
	}: {
		gridEl: HTMLElement | null;
		edges: Edge[];
		editMode?: boolean;
	} = $props();

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

	function handleDelete(edge: Edge, event: MouseEvent) {
		event.stopPropagation();
		removeEdge(edge.from, edge.to);
	}
</script>

<svg class={['absolute inset-0 h-full w-full', !editMode && 'pointer-events-none']}>
	{#each linePositions as line (line.key)}
		{@const midX = (line.from.x + line.to.x) / 2}
		{@const midY = (line.from.y + line.to.y) / 2}
		<g class={editMode ? 'group/edge' : undefined}>
			<line
				x1={line.from.x}
				y1={line.from.y}
				x2={line.to.x}
				y2={line.to.y}
				stroke="currentColor"
				stroke-width="2"
				class="pointer-events-none text-gray-500"
			/>
			{#if editMode}
				<line
					data-edge-hit
					x1={line.from.x}
					y1={line.from.y}
					x2={line.to.x}
					y2={line.to.y}
					stroke="transparent"
					stroke-width="16"
					class="cursor-pointer"
				/>
				<foreignObject
					x={midX - 12}
					y={midY - 12}
					width="24"
					height="24"
					class="pointer-events-none opacity-0 group-hover/edge:pointer-events-auto group-hover/edge:opacity-100"
				>
					<button
						type="button"
						xmlns="http://www.w3.org/1999/xhtml"
						class="flex h-6 w-6 items-center justify-center text-white"
						onclick={(event) => handleDelete(line.edge, event)}
						onpointerdown={(event) => event.stopPropagation()}
						aria-label="Delete connection"
					>
						<Icon icon="lucide:x" />
					</button>
				</foreignObject>
			{/if}
		</g>
	{/each}
</svg>
