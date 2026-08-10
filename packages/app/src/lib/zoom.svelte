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

	const CLICK_DRAG_THRESHOLD = 5; // Treat drags shorter than this as clicks

	// Don't pan when clicking skill nodes, connection handles, or edges
	const panBlocked = (target: EventTarget | null) =>
		!(target instanceof Element) ||
		!!target.closest('[data-skill-draggable], [data-edge-hit]');

	const panzoomAttachment: Attachment<HTMLDivElement> = (element) => {
		let drag: { x: number; y: number; tx: number; ty: number } | null = null;
		let isPan = false;

		const instance = panzoom(element, {
			beforeMouseDown: (e) => panBlocked(e.target),
			zoomDoubleClickSpeed: 1, // Prevent double-tapping from zooming in
			minZoom: 0.25,
			maxZoom: 2,
		});

		syncTransform(instance);

		const onDown = (e: PointerEvent) => {
			if (e.button !== 0 || panBlocked(e.target)) return;
			isPan = false;
			const { x, y } = instance.getTransform();
			drag = { x: e.clientX, y: e.clientY, tx: x, ty: y };
		};

		const onMove = (e: PointerEvent) => {
			if (!drag || isPan) return;
			if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < CLICK_DRAG_THRESHOLD) return;
			isPan = true;
			window.dispatchEvent(new CustomEvent('skillmap:panstart'));
		};

		const onUp = () => {
			if (!drag) return;
			if (!isPan) {
				instance.moveTo(drag.tx, drag.ty);
				syncTransform(instance);
			}
			drag = null;
		};

		element.addEventListener('pointerdown', onDown);
		document.addEventListener('pointermove', onMove);
		document.addEventListener('pointerup', onUp);
		document.addEventListener('pointercancel', onUp);

		instance.on('transform', () => {
			syncTransform(instance);
			window.dispatchEvent(new CustomEvent('skillmap:panzoom'));
		});

		return () => {
			element.removeEventListener('pointerdown', onDown);
			document.removeEventListener('pointermove', onMove);
			document.removeEventListener('pointerup', onUp);
			document.removeEventListener('pointercancel', onUp);
			instance.dispose();
		};
	};
</script>

<div class="zoom-container relative h-full w-full" {@attach panzoomAttachment}>
	{@render children()}
</div>
