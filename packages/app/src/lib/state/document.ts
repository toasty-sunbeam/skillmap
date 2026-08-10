import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import type { MetadataMap } from '$lib/types/metadata';
import { DEFAULT_TREE_NAME } from '$lib/state/metadata';
import type { SkillNode } from '$lib/types/skill';

import type { Edge } from '$lib/types/edge';

export const doc = new Y.Doc();

export const metadata: MetadataMap = doc.getMap('meta');
export const nodesMap: Y.Map<SkillNode> = doc.getMap('nodes'); // each node is a nested map
export const edgesArray: Y.Array<Edge> = doc.getArray('edges'); // each edge is {from, to}

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