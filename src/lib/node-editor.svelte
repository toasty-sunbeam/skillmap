<script lang="ts">
	import Icon from '@iconify/svelte';
	import type * as Y from 'yjs';
	import { setEditingSkillId } from './state/editing-skill.svelte.js';
	import { useYjsKey } from './yjs.svelte.js';
	import DotRow from './dot-row.svelte';

	let { node }: { node: Y.Map<any> } = $props();

	const label = useYjsKey<string>(() => node, 'label');
	const icon = useYjsKey<string>(() => node, 'icon');
	const points = useYjsKey<number>(() => node, 'points');
	const maxPoints = useYjsKey<number>(() => node, 'maxPoints');

	function openEditor() {
		setEditingSkillId(node.get('id'));
	}
</script>

<div class="relative">
	<button
		onclick={openEditor}
		oncontextmenu={(event) => event.preventDefault()}
		class="flex h-24 w-24 flex-col items-center justify-center gap-1 border border-red-500"
		popovertarget="skill-editor"
		aria-label={`Edit skill ${label.value}`}
	>
		<div class="truncate px-1 text-xs">{label.value}</div>
		<Icon icon={icon.value} class="h-10 w-10 shrink-0" />
		<DotRow points={points.value} maxPoints={maxPoints.value} />
	</button>
	<button class="absolute top-0 right-0" aria-label={`Delete skill ${label.value}`}>
		<Icon icon="lucide:x"/>
	</button>
</div>
