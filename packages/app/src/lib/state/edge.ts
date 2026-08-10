import { doc, edgesMap } from '$lib/state/document';
import { edgeKey, normalizeEdge } from '$lib/types/edge';
import type { NodeId } from '$lib/types/ids';

export function addEdge(a: NodeId, b: NodeId) {
	if (a === b) return;

	// Setting an existing key is a no-op, so no duplicate check is needed.
	const edge = normalizeEdge(a, b);
	doc.transact(() => {
		edgesMap.set(edgeKey(edge), edge);
	});
}

export function removeEdge(a: NodeId, b: NodeId) {
	const key = edgeKey(normalizeEdge(a, b));
	doc.transact(() => {
		edgesMap.delete(key);
	});
}

export function removeEdgesForNode(id: NodeId) {
	doc.transact(() => {
		for (const [key, edge] of [...edgesMap.entries()]) {
			if (edge.from === id || edge.to === id) {
				edgesMap.delete(key);
			}
		}
	});
}
