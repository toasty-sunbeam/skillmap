import { createSubscriber } from 'svelte/reactivity';
import type * as Y from 'yjs';

/**
 * Subscribes to a Y.Map (including nested changes) and mirrors it as reactive Svelte state.
 *
 * @returns An object with a `value` getter that always returns the current snapshot.
 *          Reading `.value` in a template or derived registers a dependency, so the UI
 *          re-runs when Yjs updates the map.
 */
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
	});

	return {
		get value() {
			return snapshot;
		}
	};
}

/**
 * Subscribes to a single key on a Y.Map and mirrors it as reactive Svelte state.
 * Same `{ value }` getter pattern as {@link useYjsMap}, but scoped to one field.
 *
 * @returns An object with a reactive `value` getter/setter for `key`.
 *          Reading `.value` in a template or derived registers a dependency, so the UI
 *          re-runs when Yjs updates that key. When the key is missing, `defaultValue` is used.
 */
export function useYjsKey<T>(getMap: () => Y.Map<any>, key: string, defaultValue?: T) {
	const subscribe = createSubscriber((update) => {
		const ymap = getMap();
		const handler = () => update();
		ymap.observe(handler);
		return () => ymap.unobserve(handler);
	});

	return {
		get value(): T {
			subscribe();
			const value = getMap().get(key);
			return (value !== undefined ? value : defaultValue) as T;
		},
		set value(next: T) {
			getMap().set(key, next);
		}
	};
}
