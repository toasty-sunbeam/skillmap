import type { GridPoint } from './grid-point.js';
import type { EdgeKey, NodeId } from './ids.js';
import { edgeKeyFromIds } from './ids.js';

export interface Edge {
	from: NodeId;
	to: NodeId;
}

export interface EdgeLine {
	key: EdgeKey;
	from: GridPoint;
	to: GridPoint;
	edge: Edge;
}

/** Canonical order for undirected edges: smaller id first. */
export function normalizeEdge(a: NodeId, b: NodeId): Edge {
	return a < b ? { from: a, to: b } : { from: b, to: a };
}

export function edgeKey(edge: Edge): EdgeKey {
	return edgeKeyFromIds(edge.from, edge.to);
}

/**
 * Edges whose endpoints both still exist.
 *
 * A node can be deleted while another peer is connecting something to it, which
 * leaves an edge pointing at a missing node. No document schema can rule that out,
 * so dangling edges are filtered out when reading instead.
 */
export function connectedEdges(
	edges: { values(): IterableIterator<Edge> },
	nodeIds: Set<NodeId>
): Edge[] {
	return [...edges.values()].filter((edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to));
}
