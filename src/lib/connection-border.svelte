<script lang="ts">
	import type { Snippet } from 'svelte';
	import { connectionDrag, startConnectionDrag } from './state/connection-drag.svelte.js';
	import type { NodeId } from './types/ids.js';

	let { skillId, children }: { skillId: NodeId; children: Snippet } = $props();

	const isActiveSource = $derived(connectionDrag.fromId === skillId);
	const isDragging = $derived(connectionDrag.fromId !== null);

	const EDGE_THRESHOLD = 8;

	let wrapperEl = $state<HTMLDivElement | null>(null);
	let isOnEdge = $state(false);
	let handleX = $state(50);
	let handleY = $state(0);

	function updateHandlePosition(event: PointerEvent) {
		if (!wrapperEl) return;

		const rect = wrapperEl.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = event.clientX - cx;
		const dy = event.clientY - cy;

		const w = rect.width / 2;
		const h = rect.height / 2;

		if (dx === 0 && dy === 0) return;

		let hx: number;
		let hy: number;

		if (Math.abs(dx) * h > Math.abs(dy) * w) {
			hx = Math.sign(dx) * w;
			hy = dy * (w / Math.abs(dx));
		} else {
			hy = Math.sign(dy) * h;
			hx = dx * (h / Math.abs(dy));
		}

		handleX = ((hx + w) / rect.width) * 100;
		handleY = ((hy + h) / rect.height) * 100;
	}

	function handlePointerMove(event: PointerEvent) {
		if (!wrapperEl) return;

		const rect = wrapperEl.getBoundingClientRect();
		const localX = event.clientX - rect.left;
		const localY = event.clientY - rect.top;
		const distToEdge = Math.min(localX, localY, rect.width - localX, rect.height - localY);

		isOnEdge = distToEdge <= EDGE_THRESHOLD;

		if (isOnEdge) {
			updateHandlePosition(event);
		}
	}

	function handlePointerDown(event: PointerEvent) {
		event.stopPropagation();
		event.preventDefault();
		startConnectionDrag(skillId);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={wrapperEl}
	class={[
		'absolute inset-0 rounded-sm border border-white bg-black p-1',
		isActiveSource && 'border-blue-400'
	]}
	onpointerleave={() => (isOnEdge = false)}
	onpointermove={handlePointerMove}
>
	{@render children()}

	{#if isOnEdge && !isDragging}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			data-connection-border
			class="absolute z-20 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-auto items-center justify-center rounded-full border border-white bg-black"
			style:left="{handleX}%"
			style:top="{handleY}%"
			onpointerdown={handlePointerDown}
		>
			<div class="h-1.5 w-1.5 rounded-full bg-white"></div>
		</div>
	{/if}
</div>
