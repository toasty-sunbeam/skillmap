<script lang="ts">
	import type { Edge, EdgeLine } from './types/edge.js';
	import { edgeKey } from './types/edge.js';
	import { getNodeCenter } from './grid-coords.js';

	let {
		gridEl,
		edges
	}: {
		gridEl: HTMLElement | null;
		edges: Edge[];
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
				return { key: edgeKey(edge), from, to };
			})
			.filter((line): line is EdgeLine => line !== null);
	});
</script>

<svg class="pointer-events-none absolute inset-0 h-full w-full">
	{#each linePositions as line (line.key)}
		<line
			x1={line.from.x}
			y1={line.from.y}
			x2={line.to.x}
			y2={line.to.y}
			stroke="currentColor"
			stroke-width="2"
			class="text-gray-500"
		/>
	{/each}
</svg>
