import type { NodeId } from '$lib/types/ids.js';

let editingSkillId = $state<NodeId | null>(null);

export function getEditingSkillId(): NodeId | null {
	return editingSkillId;
}

export function setEditingSkillId(id: NodeId | null) {
	editingSkillId = id;
}
