import * as Y from 'yjs';
import { nodesMap, doc } from '$lib/state/document';
import type { SkillNode } from '$lib/types/skill';
import { newNodeId, type NodeId } from '$lib/types/ids';

export function addSkill(x: number, y: number) {
	const id = newNodeId();
	const node: SkillNode = new Y.Map();

	doc.transact(() => {
		node.set('id', id);
		node.set('x', x);
		node.set('y', y);
		node.set('label', "New skill");
		node.set('icon', 'lucide: circle');
		node.set('points', 0);
		node.set('maxPoints', 1);
		nodesMap.set(id, node);
	});
}

export function clearSkills() {
	nodesMap.clear();
}

export function moveSkill(id: NodeId, newX: number, newY: number) {
	const node = nodesMap.get(id);
	if (!node) throw new Error(`moveSkill can't find node ${id}`);
	doc.transact(() => {
		node.set('x', newX);
		node.set('y', newY);
	})
}

export function renameSkill(id: NodeId, name: string) {
	const node = nodesMap.get(id);
	if (!node) throw new Error(`Can't find node ${id}`);
	doc.transact(() => {
		node.set('label', name);
	});
}

export function setMaxPoints(id: NodeId, maxPoints: number) {
	const node = nodesMap.get(id);
	if (!node) throw new Error(`Can't find node ${id}`);
	doc.transact(() => {
		node.set('maxPoints', maxPoints);
	});
}

export function setIcon(id: NodeId, icon: string) {
	const node = nodesMap.get(id);
	if (!node) throw new Error(`Can't find node ${id}`);
	doc.transact(() => {
		node.set('icon', icon);
	});
}
