<script lang="ts">
	import type * as Y from 'yjs';

	let { node }: { node: Y.Map<any> } = $props();

	function handleClick() {
	}
	function handleRightClick(event: MouseEvent) {
		event.preventDefault();
	}
</script>

<button
	onclick={handleClick}
	oncontextmenu={handleRightClick}
	class="border border-red-500"
	popovertarget="skill-editor"
>
	<div>{node.get('label')}</div>
	<div>{node.get('points')}/{node.get('maxPoints')}</div>
</button>