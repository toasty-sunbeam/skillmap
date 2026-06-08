<script lang="ts">
	import panzoom from 'panzoom';

	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';

	let { children }: { children: Snippet } = $props();

	const panzoomAttachment: Attachment<HTMLDivElement> = (element) => {
		const instance = panzoom(element);
		instance.on('transform', () => {
			window.dispatchEvent(new CustomEvent('skillmap:panzoom'));
		});

		return () => instance.dispose();
	};
</script>

<div class="zoom-container relative h-[calc(100vh-4rem)] w-full overflow-hidden" {@attach panzoomAttachment}>
	{@render children()}
</div>