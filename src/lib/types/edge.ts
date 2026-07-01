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
}

/** Canonical order for undirected edges: smaller id first. */
export function normalizeEdge(a: NodeId, b: NodeId): Edge {
	return a < b ? { from: a, to: b } : { from: b, to: a };
}

export function edgeKey(edge: Edge): EdgeKey {
	return edgeKeyFromIds(edge.from, edge.to);
}
