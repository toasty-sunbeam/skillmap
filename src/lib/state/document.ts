import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

export const doc = new Y.Doc();

export const nodesMap = doc.getMap('nodes'); // each node is a nested map
export const edgesArray = doc.getArray('edges'); // each edge is {from, to}

let persistence: IndexeddbPersistence | null = null;
if (typeof window !== undefined) {
	persistence = new IndexeddbPersistence('talent-tree', doc);
}

export { persistence };