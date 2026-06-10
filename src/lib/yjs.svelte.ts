import { onMount, onDestroy } from "svelte";
import * as Y from 'yjs';

export function useYjsMap(ymap: Y.Map<any>) {
	let snapshot = $state(new Map(ymap.entries()));

	$effect(() => {
		// Sync initial state
		snapshot = new Map(ymap.entries());

		// Subscribe to changes
		const handler = () => {
			snapshot = new Map(ymap.entries());
		};
		ymap.observeDeep(handler);

		return () => ymap.unobserveDeep(handler);
	})

	return {
		get value() { return snapshot; }
	}
}