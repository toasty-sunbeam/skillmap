<script lang="ts">
	import panzoom from 'panzoom';
	
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();

	let container: HTMLDivElement | undefined;

	$effect(() => {
		if (!container) return;
		const instance = panzoom(container);
		return () => instance.dispose();
	})
</script>

<div class="zoom-container relative h-[calc(100vh-4rem)] w-full overflow-hidden" bind:this={container}>
	{@render children()}
</div>