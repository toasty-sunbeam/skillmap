import * as Y from 'yjs';
import { nodesMap, doc } from '$lib/state/document';

type uuid = ReturnType<typeof crypto.randomUUID>;

export function addSkill(x: number, y: number) {
	const id: uuid = crypto.randomUUID();
	const node = new Y.Map();

	node.set('id', id);
	node.set('x', x);
	node.set('y', y);
	node.set('label', "New skill");
	node.set('icon', 'lucide: circle');
	node.set('points', 0);
	node.set('maxPoints', 1);
	nodesMap.set(id, node);
}

export function clearSkills() {
	nodesMap.clear();
}

export function moveSkill(id: uuid, newX: number, newY: number) {
	const node = nodesMap.get(id) as Y.Map<any>;
	if (!node) throw new Error(`moveSkill can't find node ${id}`);
	doc.transact(() => {
		node.set('x', newX);
		node.set('y', newY);
	})
}