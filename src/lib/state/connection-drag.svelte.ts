import { clientToGridLocal } from '$lib/grid-coords.js';
import type { NodeId } from '$lib/types/ids.js';

export const connectionDrag = $state({
	fromId: null as NodeId | null,
	previewEnd: null as { x: number; y: number } | null
});

export function startConnectionDrag(fromId: NodeId) {
	connectionDrag.fromId = fromId;
	connectionDrag.previewEnd = null;
}

export function updateConnectionPreview(
	clientX: number,
	clientY: number,
	gridEl: HTMLElement
) {
	if (!connectionDrag.fromId) return;
	connectionDrag.previewEnd = clientToGridLocal(clientX, clientY, gridEl);
}

export function cancelConnectionDrag() {
	connectionDrag.fromId = null;
	connectionDrag.previewEnd = null;
}

export function finishConnectionDrag(): NodeId | null {
	const fromId = connectionDrag.fromId;
	cancelConnectionDrag();
	return fromId;
}
