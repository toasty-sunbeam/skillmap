<script lang="ts">
	import type * as Y from 'yjs';

	let { node }: { node: Y.Map<any> } = $props();

	function handleClick() {
		const points = node.get('points');
		const maxPoints = node.get('maxPoints');
		if (points < maxPoints) {
			node.set('points', points + 1);
		}
	}
	function handleRightClick(event: MouseEvent) {
		event.preventDefault();
		const points = node.get('points');
		if (points > 0) {
			node.set('points', points - 1);
		}
	}
</script>

<button onclick={handleClick} oncontextmenu={handleRightClick} class="border border-gray-500">
	<div>{node.get('label')}</div>
	<div>{node.get('points')}/{node.get('maxPoints')}</div>
</button>