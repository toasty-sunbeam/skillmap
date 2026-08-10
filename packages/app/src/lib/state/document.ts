import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import type { MetadataMap } from '$lib/types/metadata';
import { DEFAULT_TREE_NAME } from '$lib/state/metadata';
import type { SkillNode } from '$lib/types/skill';

import type { Edge } from '$lib/types/edge';

export const doc = new Y.Doc();

export const metadata: MetadataMap = doc.getMap('meta');
export const nodesMap: Y.Map<SkillNode> = doc.getMap('nodes'); // each node is a nested map

/**
 * Edges keyed by their canonical `edgeKey` (smaller node id first), so that peers
 * adding the same connection concurrently converge on a single entry rather than
 * each contributing one.
 */
export const edgesMap: Y.Map<Edge> = doc.getMap('edges');

let persistence: IndexeddbPersistence | null = null;
if (typeof window !== 'undefined') {
	persistence = new IndexeddbPersistence('talent-tree', doc);
	persistence.on('synced', () => {
		if (!metadata.has('name')) {
			doc.transact(() => metadata.set('name', DEFAULT_TREE_NAME));
		}
	});
}

export { persistence };