<script lang="ts">
	import type * as Y from 'yjs';
	import { useYjsKey } from './yjs.svelte.js';

	let { node }: { node: Y.Map<any> } = $props();

	const label = useYjsKey<string>(() => node, 'label');
	const points = useYjsKey<number>(() => node, 'points');
	const maxPoints = useYjsKey<number>(() => node, 'maxPoints');

	function handleClick() {
		if (points.value < maxPoints.value) {
			node.set('points', points.value + 1);
		}
	}

	function handleRightClick(event: MouseEvent) {
		event.preventDefault();
		if (points.value > 0) {
			node.set('points', points.value - 1);
		}
	}
</script>

<button onclick={handleClick} oncontextmenu={handleRightClick} class="border border-gray-500">
	<div>{label.value}</div>
	<div>{points.value}/{maxPoints.value}</div>
</button>
