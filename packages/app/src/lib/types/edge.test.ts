import { describe, expect, test } from 'bun:test';
import * as Y from 'yjs';
// Relative rather than `$lib`, so the suite runs from the repo root as well as
// from this package (the `$lib` alias is only defined in the app's tsconfig).
import { connectedEdges, edgeKey, normalizeEdge, type Edge } from './edge';
import { asNodeId } from './ids';

/**
 * `state/edge.ts` operates on the single module-level `Y.Doc` in `state/document.ts`,
 * which is bound to the browser and IndexedDB. Its add/remove logic is mirrored here
 * against local docs instead, so that merge behaviour can be exercised with two
 * independent peers. Keep the two in step.
 */
function makePeer() {
	const doc = new Y.Doc();
	const edges = doc.getMap<Edge>('edges');
	const nodes = doc.getMap<Y.Map<unknown>>('nodes');

	return {
		doc,
		edges,
		nodes,
		addEdge(a: string, b: string) {
			if (a === b) return;
			const edge = normalizeEdge(asNodeId(a), asNodeId(b));
			doc.transact(() => edges.set(edgeKey(edge), edge));
		},
		removeEdge(a: string, b: string) {
			const key = edgeKey(normalizeEdge(asNodeId(a), asNodeId(b)));
			doc.transact(() => edges.delete(key));
		},
		keys() {
			return [...edges.keys()].sort();
		}
	};
}

/** Exchange state vectors and diffs, the way a sync server will. */
function sync(a: { doc: Y.Doc }, b: { doc: Y.Doc }) {
	const aToB = Y.encodeStateAsUpdate(a.doc, Y.encodeStateVector(b.doc));
	const bToA = Y.encodeStateAsUpdate(b.doc, Y.encodeStateVector(a.doc));
	Y.applyUpdate(b.doc, aToB);
	Y.applyUpdate(a.doc, bToA);
}

describe('edges converge across peers', () => {
	test('the same connection added concurrently collapses to one edge', () => {
		const alice = makePeer();
		const bob = makePeer();

		alice.addEdge('fireball', 'frostbolt');
		bob.addEdge('fireball', 'frostbolt');
		sync(alice, bob);

		expect(alice.edges.size).toBe(1);
		expect(bob.keys()).toEqual(alice.keys());
	});

	test('a connection dragged in opposite directions is one edge', () => {
		const alice = makePeer();
		const bob = makePeer();

		alice.addEdge('aaa', 'zzz');
		bob.addEdge('zzz', 'aaa');
		sync(alice, bob);

		expect(alice.keys()).toEqual(['aaa:zzz']);
	});

	test('one removal deletes an edge both peers added', () => {
		const alice = makePeer();
		const bob = makePeer();

		alice.addEdge('a', 'b');
		bob.addEdge('a', 'b');
		sync(alice, bob);

		alice.removeEdge('a', 'b');
		sync(alice, bob);

		expect(alice.edges.size).toBe(0);
		expect(bob.edges.size).toBe(0);
	});

	test('concurrent add and remove leaves peers agreeing', () => {
		const alice = makePeer();
		const bob = makePeer();

		alice.addEdge('n1', 'n2');
		sync(alice, bob);

		alice.removeEdge('n1', 'n2');
		bob.addEdge('n1', 'n2');
		sync(alice, bob);

		// Which side wins is arbitrary, but the peers must not diverge.
		expect(alice.keys()).toEqual(bob.keys());
	});

	test('updates can be applied in any order', () => {
		const peers = [makePeer(), makePeer(), makePeer(), makePeer()];
		peers[0].addEdge('a', 'b');
		peers[1].addEdge('b', 'a');
		peers[2].addEdge('a', 'b');
		peers[3].addEdge('c', 'd');

		const updates = peers.map((peer) => Y.encodeStateAsUpdate(peer.doc));
		const forwards = new Y.Doc();
		const backwards = new Y.Doc();
		updates.forEach((update) => Y.applyUpdate(forwards, update));
		[...updates].reverse().forEach((update) => Y.applyUpdate(backwards, update));

		const keysOf = (doc: Y.Doc) => [...doc.getMap<Edge>('edges').keys()].sort();
		expect(keysOf(forwards)).toEqual(['a:b', 'c:d']);
		expect(keysOf(backwards)).toEqual(keysOf(forwards));
	});
});

describe('connectedEdges', () => {
	test('drops edges whose endpoints no longer exist', () => {
		const alice = makePeer();
		const bob = makePeer();
		for (const peer of [alice, bob]) {
			peer.nodes.set('x', new Y.Map());
			peer.nodes.set('y', new Y.Map());
		}
		sync(alice, bob);

		// Alice deletes a node while Bob connects something to it.
		alice.doc.transact(() => alice.nodes.delete('x'));
		bob.addEdge('x', 'y');
		sync(alice, bob);

		expect(alice.edges.size).toBe(1); // the dangling edge is still in the document
		const nodeIds = new Set([...alice.nodes.keys()].map(asNodeId));
		expect(connectedEdges(alice.edges, nodeIds)).toEqual([]);
	});

	test('keeps edges between nodes that both exist', () => {
		const peer = makePeer();
		peer.nodes.set('x', new Y.Map());
		peer.nodes.set('y', new Y.Map());
		peer.addEdge('x', 'y');

		const nodeIds = new Set([...peer.nodes.keys()].map(asNodeId));
		expect(connectedEdges(peer.edges, nodeIds)).toEqual([
			{ from: asNodeId('x'), to: asNodeId('y') }
		]);
	});
});
