import type { Attachment } from 'svelte/attachments';
import { moveSkill } from '$lib/state/skill';
import { getField, type SkillNode } from '$lib/types/skill';
import { CELL_SIZE } from './grid';

const DRAG_THRESHOLD = 5;

export function draggable(node: SkillNode): Attachment<HTMLElement> {
	return (element) => {
		let startX = 0;
		let startY = 0;
		let hasMoved = false;

		function getScale(): number {
			const container = element.closest('.zoom-container');
			if (!container?.firstElementChild) return 1;
			const matrix = new DOMMatrix(
				getComputedStyle(container.firstElementChild).transform
			);
			return matrix.a;
		}

		function blockPanzoom(e: Event) {
			e.stopPropagation();
		}

		function onPointerDown(e: PointerEvent) {
			if (e.button !== 0) return;
			blockPanzoom(e);
			element.setPointerCapture(e.pointerId);
			startX = e.clientX;
			startY = e.clientY;
			hasMoved = false;
		}

		function onPointerMove(e: PointerEvent) {
			if (!element.hasPointerCapture(e.pointerId)) return;

			const dx = e.clientX - startX;
			const dy = e.clientY - startY;

			if (!hasMoved) {
				if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
				hasMoved = true;
				element.style.cursor = 'grabbing';
				element.style.zIndex = '10';
			}

			const scale = getScale();
			element.style.transform =
				`translate(calc(-50% + ${dx / scale}px), calc(-50% + ${dy / scale}px))`;
		}

		function onPointerUp(e: PointerEvent) {
			if (!element.hasPointerCapture(e.pointerId)) return;
			element.releasePointerCapture(e.pointerId);

			if (!hasMoved) return;

			const scale = getScale();
			const gridDx = Math.round((e.clientX - startX) / scale / CELL_SIZE);
			const gridDy = Math.round((e.clientY - startY) / scale / CELL_SIZE);

			element.style.transform = 'translate(-50%, -50%)';
			element.style.cursor = '';
			element.style.zIndex = '';

			if (gridDx !== 0 || gridDy !== 0) {
				moveSkill(
					getField(node, 'id'),
					getField(node, 'x') + gridDx,
					getField(node, 'y') + gridDy
				);
			}

			element.addEventListener('click', (ev) => ev.stopPropagation(), { once: true, capture: true });
		}

		element.addEventListener('pointerdown', onPointerDown);
		element.addEventListener('pointermove', onPointerMove);
		element.addEventListener('pointerup', onPointerUp);
		// panzoom listens for mousedown/touchstart, not pointerdown
		element.addEventListener('mousedown', blockPanzoom);
		element.addEventListener('touchstart', blockPanzoom, { passive: true });

		return () => {
			element.removeEventListener('pointerdown', onPointerDown);
			element.removeEventListener('pointermove', onPointerMove);
			element.removeEventListener('pointerup', onPointerUp);
			element.removeEventListener('mousedown', blockPanzoom);
			element.removeEventListener('touchstart', blockPanzoom);
		};
	};
}