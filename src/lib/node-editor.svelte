<script lang="ts">
	import Icon from '@iconify/svelte';
	import type * as Y from 'yjs';
	import { setEditingSkillId } from './state/editing-skill.svelte.js';
	import { useYjsKey } from './yjs.svelte.js';
	import DotRow from './dot-row.svelte';
	import ConnectionBorder from './connection-border.svelte';
	import { getField } from './types/skill.js';

	let { node }: { node: Y.Map<any> } = $props();

	const skillId = $derived(getField(node, 'id'));
	const label = useYjsKey<string>(() => node, 'label');
	const icon = useYjsKey<string>(() => node, 'icon');
	const points = useYjsKey<number>(() => node, 'points');
	const maxPoints = useYjsKey<number>(() => node, 'maxPoints');

	function openEditor() {
		setEditingSkillId(skillId);
	}
</script>

<div class="relative h-24 w-24">
	<ConnectionBorder {skillId}>
		<button
			onclick={openEditor}
			oncontextmenu={(event) => event.preventDefault()}
			onpointerdown={(event) => event.stopPropagation()}
			class="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 rounded-sm bg-black"
			popovertarget="skill-editor"
			aria-label={`Edit skill ${label.value}`}
		>
			<div class="truncate px-1 text-xs">{label.value}</div>
			<Icon icon={icon.value} class="h-10 w-10 shrink-0" />
			<DotRow points={points.value} maxPoints={maxPoints.value} />
		</button>
	</ConnectionBorder>
	<button
		class="absolute top-0 right-0 z-20"
		onpointerdown={(event) => event.stopPropagation()}
		aria-label={`Delete skill ${label.value}`}
	>
		<Icon icon="lucide:x" />
	</button>
</div>
