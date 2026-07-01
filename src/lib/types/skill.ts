import type * as Y from 'yjs';
import type { NodeId } from './ids.js';

export interface SkillFields {
	id: NodeId;
	x: number;
	y: number;
	label: string;
	icon: string;
	points: number;
	maxPoints: number;
}

// The Y.Map holding a union of all possible value types
export type SkillNode = Y.Map<SkillFields[keyof SkillFields]>;

// Typed getter — narrows the return type per key
export function getField<K extends keyof SkillFields>(
	node: SkillNode,
	key: K
): SkillFields[K] {
	return node.get(key) as SkillFields[K];
}