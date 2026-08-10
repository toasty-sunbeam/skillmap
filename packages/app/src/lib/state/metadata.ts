export const DEFAULT_TREE_NAME = 'Talent tree';

import { doc, metadata } from '$lib/state/document';

export function getTreeName(): string {
	return metadata.get('name') ?? DEFAULT_TREE_NAME;
}

export function setTreeName(name: string) {
	doc.transact(() => {
		metadata.set('name', name);
	})
}