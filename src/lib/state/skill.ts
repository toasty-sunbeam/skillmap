import * as Y from 'yjs';
import { nodesMap } from '$lib/state/document';

export function addSkill(x: number, y: number) {
	const id = crypto.randomUUID();
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