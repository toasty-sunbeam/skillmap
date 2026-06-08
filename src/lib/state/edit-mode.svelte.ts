let editMode = $state(false);

export function inEditMode(): boolean { return editMode; }

export function toggleEditMode() {
	editMode = !editMode;
}
