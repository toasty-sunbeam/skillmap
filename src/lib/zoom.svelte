<script lang="ts">
	import panzoom from 'panzoom';

	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { panzoomTransform } from './state/panzoom.svelte.js';

	let { children }: { children: Snippet } = $props();

	function syncTransform(instance: ReturnType<typeof panzoom>) {
		const t = instance.getTransform();
		panzoomTransform.x = t.x;
		panzoomTransform.y = t.y;
		panzoomTransform.scale = t.scale;
	}

	const panzoomAttachment: Attachment<HTMLDivElement> = (element) => {
		const instance = panzoom(element, {
			beforeMouseDown(event) {
				const target = event.target;
				return target instanceof Element && !!target.closest('[data-skill-draggable]');
			},
			zoomDoubleClickSpeed: 1 // Prevent double-tapping from zooming in
		});

		syncTransform(instance);

		instance.on('panstart', () => {
			window.dispatchEvent(new CustomEvent('skillmap:panstart'));
		});
		instance.on('transform', () => {
			syncTransform(instance);
			window.dispatchEvent(new CustomEvent('skillmap:panzoom'));
		});

		return () => instance.dispose();
	};
</script>

<div class="zoom-container relative h-full w-full" {@attach panzoomAttachment}>
	{@render children()}
</div>
