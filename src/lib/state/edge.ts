import { doc, edgesArray } from '$lib/state/document';
import { edgeKey, normalizeEdge, type Edge } from '$lib/types/edge';
import type { NodeId } from '$lib/types/ids';

function hasEdge(a: NodeId, b: NodeId): boolean {
	const normalized = normalizeEdge(a, b);
	const key = edgeKey(normalized);
	for (let i = 0; i < edgesArray.length; i++) {
		const edge = edgesArray.get(i) as Edge;
		if (edgeKey(edge) === key) return true;
	}
	return false;
}

export function addEdge(a: NodeId, b: NodeId) {
	if (a === b) return;
	if (hasEdge(a, b)) return;

	const edge = normalizeEdge(a, b);
	doc.transact(() => {
		edgesArray.push([edge]);
	});
}

export function removeEdgesForNode(id: NodeId) {
	doc.transact(() => {
		for (let i = edgesArray.length - 1; i >= 0; i--) {
			const edge = edgesArray.get(i) as Edge;
			if (edge.from === id || edge.to === id) {
				edgesArray.delete(i, 1);
			}
		}
	});
}
