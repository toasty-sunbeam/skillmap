<script lang="ts">
	import type { Snippet } from 'svelte';
	import { connectionDrag, startConnectionDrag } from './state/connection-drag.svelte.js';
	import type { NodeId } from './types/ids.js';

	let { skillId, children }: { skillId: NodeId; children: Snippet } = $props();

	const isActiveSource = $derived(connectionDrag.fromId === skillId);

	function handlePointerDown(event: PointerEvent) {
		if (event.target !== event.currentTarget) return;
		event.stopPropagation();
		event.preventDefault();
		startConnectionDrag(skillId);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	data-connection-border
	class={[
		'absolute inset-0 rounded-sm border border-white bg-black p-1 transition-[border-width]',
		'hover:border-2',
		isActiveSource && 'border-2 border-blue-400'
	]}
	onpointerdown={handlePointerDown}
>
	{@render children()}
</div>
