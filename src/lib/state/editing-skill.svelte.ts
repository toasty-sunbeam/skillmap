let editingSkillId = $state<string | null>(null);

export function getEditingSkillId(): string | null {
	return editingSkillId;
}

export function setEditingSkillId(id: string | null) {
	editingSkillId = id;
}
