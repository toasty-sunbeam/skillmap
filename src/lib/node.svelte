<script lang="ts">
	import Icon from '@iconify/svelte';
	import type * as Y from 'yjs';
	import DotRow from './dot-row.svelte';
	import { useYjsKey } from './yjs.svelte.js';

	let { node }: { node: Y.Map<any> } = $props();

	const label = useYjsKey<string>(() => node, 'label');
	const icon = useYjsKey<string>(() => node, 'icon');
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

<button
	onclick={handleClick}
	oncontextmenu={handleRightClick}
	class="flex h-24 w-24 flex-col items-center justify-center gap-1 border border-gray-500 rounded-sm"
>
	<div class="truncate px-1 text-xs">{label.value}</div>

	<Icon icon={icon.value} class="h-10 w-10 shrink-0" />

	<DotRow points={points.value} maxPoints={maxPoints.value} />
</button>
