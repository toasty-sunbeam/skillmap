<script lang="ts">
	import { getNodeCenter } from './grid-coords.js';
	import { connectionDrag } from './state/connection-drag.svelte.js';

	let { gridEl }: { gridEl: HTMLElement | null } = $props();

	let tick = $state(0);

	$effect(() => {
		const bump = () => {
			tick++;
		};
		window.addEventListener('skillmap:panzoom', bump);
		return () => window.removeEventListener('skillmap:panzoom', bump);
	});

	const previewLine = $derived.by(() => {
		tick;
		connectionDrag.fromId;
		connectionDrag.previewEnd;
		if (!gridEl || !connectionDrag.fromId || !connectionDrag.previewEnd) return null;

		const from = getNodeCenter(connectionDrag.fromId, gridEl);
		if (!from) return null;

		return { from, to: connectionDrag.previewEnd };
	});
</script>

{#if previewLine}
	<svg class="pointer-events-none absolute inset-0 z-10 h-full w-full">
		<line
			x1={previewLine.from.x}
			y1={previewLine.from.y}
			x2={previewLine.to.x}
			y2={previewLine.to.y}
			stroke="currentColor"
			stroke-width="2"
			stroke-dasharray="6 4"
			class="text-blue-400"
		/>
	</svg>
{/if}
