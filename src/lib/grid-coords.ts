import { panzoomTransform } from './state/panzoom.svelte.js';
import type { GridPoint } from './types/grid-point.js';
import { asNodeId, type NodeId } from './types/ids.js';

export function clientToGridLocal(
	clientX: number,
	clientY: number,
	gridEl: HTMLElement
): GridPoint {
	const rect = gridEl.getBoundingClientRect();
	const scale = panzoomTransform.scale;
	return {
		x: (clientX - rect.left) / scale,
		y: (clientY - rect.top) / scale
	};
}

export function getNodeCenter(
	id: NodeId,
	gridEl: HTMLElement
): GridPoint | null {
	const wrapper = gridEl.querySelector(`[data-skill-id="${id}"]`);
	if (!wrapper) return null;

	const gridRect = gridEl.getBoundingClientRect();
	const nodeRect = wrapper.getBoundingClientRect();
	const scale = panzoomTransform.scale;

	return {
		x: (nodeRect.left + nodeRect.width / 2 - gridRect.left) / scale,
		y: (nodeRect.top + nodeRect.height / 2 - gridRect.top) / scale
	};
}

export function getSkillIdFromElement(element: Element | null): NodeId | null {
	const wrapper = element?.closest('[data-skill-id]');
	const id = wrapper?.getAttribute('data-skill-id');
	return id ? asNodeId(id) : null;
}
