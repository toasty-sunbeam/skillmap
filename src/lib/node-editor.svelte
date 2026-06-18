<script lang="ts">
	import type * as Y from 'yjs';
	import { setEditingSkillId } from './state/editing-skill.svelte.js';
	import { useYjsKey } from './yjs.svelte.js';

	let { node }: { node: Y.Map<any> } = $props();

	const label = useYjsKey<string>(() => node, 'label');
	const points = useYjsKey<number>(() => node, 'points');
	const maxPoints = useYjsKey<number>(() => node, 'maxPoints');

	function openEditor() {
		setEditingSkillId(node.get('id'));
	}
</script>

<button
	onclick={openEditor}
	oncontextmenu={(event) => event.preventDefault()}
	class="border border-red-500 cursor-grab"
	popovertarget="skill-editor"
>
	<div>{label.value}</div>
	<div>{points.value}/{maxPoints.value}</div>
</button>
