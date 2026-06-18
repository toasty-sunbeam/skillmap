import {
	draggable,
	events,
	grid,
	instances,
	threshold,
	transform,
	unstable_definePlugin,
	type DragEventData
} from '@neodrag/svelte';
import type { Attachment } from 'svelte/attachments';
import { getField, type SkillNode } from './types/skill.js';
import { moveSkill } from './state/skill.js';

/** Pixel size of one grid cell — used by neodrag's grid plugin and node layout. */
export const GRID_SNAP = 120;

function blockPanzoom(event: Event) {
	event.stopPropagation();
}

function getPanzoomScale(element: Element): number {
	const container = element.closest('.zoom-container');
	if (!container) return 1;

	const matrix = getComputedStyle(container).transform;
	if (!matrix || matrix === 'none') return 1;

	const scale = new DOMMatrix(matrix).a;
	return scale > 0 ? scale : 1;
}

/** Neodrag's offsetWidth/rect inverse scale diverges from panzoom under nested transforms. */
const panzoomDrag = unstable_definePlugin(() => ({
	name: 'skillmap:panzoom-drag',
	priority: 100,
	drag(ctx, _state, event) {
		const scale = getPanzoomScale(ctx.rootNode);
		const targetX = (event.clientX - ctx.initial.x) / scale;
		const targetY = (event.clientY - ctx.initial.y) / scale;
		ctx.propose(targetX - ctx.offset.x, targetY - ctx.offset.y);
	}
}));

const centeredTransform = transform(({ offset, rootNode }) => {
	rootNode.style.removeProperty('translate');
	rootNode.style.transform = `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`;
});

export function skillDraggable(node: SkillNode): Attachment<HTMLElement> {
	const id = getField(node, 'id');
	const plugins = [
		threshold({ distance: 5 }),
		panzoomDrag(),
		grid([GRID_SNAP, GRID_SNAP]),
		centeredTransform,
		events({
			onDrag() {
				window.dispatchEvent(new CustomEvent('skillmap:panzoom'));
			},
			onDragEnd(data: DragEventData) {
				const dx = data.offset.x / GRID_SNAP;
				const dy = data.offset.y / GRID_SNAP;

				if (dx !== 0 || dy !== 0) {
					moveSkill(id, getField(node, 'x') + dx, getField(node, 'y') + dy);
				}

				instances.get(data.rootNode)?.ctx.setForcedPosition(0, 0);
			}
		})
	];

	const neodrag = draggable(plugins);

	return (element) => {
		element.dataset.skillDraggable = '';
		element.addEventListener('mousedown', blockPanzoom);
		element.addEventListener('touchstart', blockPanzoom, { passive: true });

		const cleanupNeodrag = neodrag(element);

		return () => {
			element.removeEventListener('mousedown', blockPanzoom);
			element.removeEventListener('touchstart', blockPanzoom);
			cleanupNeodrag?.();
		};
	};
}
