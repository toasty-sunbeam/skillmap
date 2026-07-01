declare const nodeIdBrand: unique symbol;
/** UUID identifying a skill node in the document. */
export type NodeId = string & { readonly [nodeIdBrand]: true };

declare const edgeKeyBrand: unique symbol;
/** Canonical lookup key for an undirected edge (`smallerId:largerId`). */
export type EdgeKey = string & { readonly [edgeKeyBrand]: true };

export function newNodeId(): NodeId {
	return crypto.randomUUID() as NodeId;
}

/** Assert that a string is a node id (e.g. from Yjs or the DOM). */
export function asNodeId(value: string): NodeId {
	return value as NodeId;
}

export function asEdgeKey(value: string): EdgeKey {
	return value as EdgeKey;
}

export function edgeKeyFromIds(a: NodeId, b: NodeId): EdgeKey {
	return `${a}:${b}` as EdgeKey;
}
