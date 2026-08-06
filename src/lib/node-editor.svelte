<script lang="ts">
	import Icon from '@iconify/svelte';
	import type * as Y from 'yjs';
	import { getEditingSkillId, setEditingSkillId } from './state/editing-skill.svelte.js';
	import { deleteSkill } from './state/skill.js';
	import { useYjsKey } from './yjs.svelte.js';
	import DotRow from './dot-row.svelte';
	import { connectionDrag, startConnectionDrag } from './state/connection-drag.svelte.js';
	import { getField } from './types/skill.js';
	import type { ToolId } from './toolbox.svelte';

	let { node, activeTool }: { node: Y.Map<any>, activeTool: ToolId } = $props();

	const skillId = $derived(getField(node, 'id'));
	const label = useYjsKey<string>(() => node, 'label');
	const icon = useYjsKey<string>(() => node, 'icon');
	const points = useYjsKey<number>(() => node, 'points');
	const maxPoints = useYjsKey<number>(() => node, 'maxPoints');

	const isActiveSource = $derived(connectionDrag.fromId === skillId);

	function openEditor() {
		if (activeTool === 'edit-skill') {
			setEditingSkillId(skillId);
		}
	}

	function handleDelete() {
		deleteSkill(skillId);
		if (getEditingSkillId() === skillId) {
			setEditingSkillId(null);
			document.getElementById('skill-editor')?.hidePopover();
		}
	}

	function handlePointerDown(event: PointerEvent) {
		if (activeTool !== 'connect-skills') return;
		event.stopPropagation();
		event.preventDefault();
		startConnectionDrag(skillId);
	}
</script>

<div
	role="group"
	class={[
		'relative h-24 w-24 rounded-sm border bg-black p-1',
		isActiveSource ? 'border-blue-400' : 'border-white',
		activeTool === 'connect-skills' && 'cursor-crosshair',
	]}
	onpointerdown={handlePointerDown}
>
	<button
		onclick={openEditor}
		oncontextmenu={(event) => event.preventDefault()}
		class="flex h-full w-full flex-col items-center justify-center gap-1 rounded-sm bg-black"
		class:cursor-pointer={activeTool === 'edit-skill'}
		popovertarget={activeTool === 'edit-skill' ? 'skill-editor' : undefined}
		aria-label={`Edit skill ${label.value}`}
	>
		<div class="truncate px-1 text-xs">{label.value}</div>
		<Icon icon={icon.value} class="h-10 w-10 shrink-0" />
		<DotRow points={points.value} maxPoints={maxPoints.value} />
	</button>
	<button
		type="button"
		class="absolute top-0 right-0 z-20"
		onclick={handleDelete}
		onpointerdown={(event) => event.stopPropagation()}
		aria-label={`Delete skill ${label.value}`}
	>
		<Icon icon="lucide:x" />
	</button>
</div>
