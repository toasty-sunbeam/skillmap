let editMode = $state(false);

export function inEditMode(): boolean { return editMode; }

export function setEditMode(value: boolean) {
	editMode = value;
}

export function toggleEditMode() {
	editMode = !editMode;
}
