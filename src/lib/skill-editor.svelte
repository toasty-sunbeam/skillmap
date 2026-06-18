<script lang="ts">
	import Icon from '@iconify/svelte';
	import { nodesMap } from './state/document.js';
	import { getEditingSkillId } from './state/editing-skill.svelte.js';
	import { renameSkill } from './state/skill.js';
	import { getField } from './types/skill.js';

	const MARGIN = 8;

	let dialog: HTMLDialogElement;
	let invoker: HTMLElement | null = null;
	let draftLabel = $state('');

	function syncPosition() {
		if (!dialog || !invoker) return;

		const rect = invoker.getBoundingClientRect();
		let top = rect.bottom + MARGIN;
		let left = rect.left;

		const dialogHeight = dialog.offsetHeight;
		const dialogWidth = dialog.offsetWidth;

		if (dialogHeight > 0 && top + dialogHeight > window.innerHeight) {
			top = rect.top - dialogHeight - MARGIN;
		}

		if (dialogWidth > 0 && left + dialogWidth > window.innerWidth) {
			left = window.innerWidth - dialogWidth - MARGIN;
		}

		if (left < MARGIN) {
			left = MARGIN;
		}

		dialog.style.top = `${top}px`;
		dialog.style.left = `${left}px`;
	}

	function loadDraftLabel() {
		const id = getEditingSkillId();
		if (!id) return;

		const node = nodesMap.get(id);
		if (!node) return;

		draftLabel = getField(node, 'label');
	}

	function saveLabel() {
		const id = getEditingSkillId();
		if (!id) return;

		const trimmed = draftLabel.trim();
		if (!trimmed) return;

		renameSkill(id, trimmed);
	}

	function onBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open' && event.source instanceof HTMLElement) {
			invoker = event.source;
			loadDraftLabel();
			syncPosition();
			requestAnimationFrame(() => syncPosition());
			window.addEventListener('skillmap:panzoom', syncPosition);
			return;
		}

		if (event.newState === 'closed') {
			invoker = null;
			window.removeEventListener('skillmap:panzoom', syncPosition);
		}
	}
</script>

<dialog bind:this={dialog} id="skill-editor" popover="manual" onbeforetoggle={onBeforeToggle}>
	<div class="flex min-w-48 flex-col gap-2">
		<div class="flex items-start justify-between gap-2">
			<label for="skill-label" class="text-sm font-medium">Name</label>
			<button type="button" popovertarget="skill-editor" popovertargetaction="hide" class="rounded-full border">
				<Icon icon="lucide:x" />
			</button>
		</div>

		<input
			id="skill-label"
			type="text"
			bind:value={draftLabel}
			onchange={saveLabel}
			onkeydown={(event) => {
				if (event.key === 'Enter') {
					event.currentTarget.blur();
				}
			}}
			class="rounded border bg-transparent px-2 py-1"
		/>
	</div>
</dialog>

<style>
	#skill-editor {
		position: fixed;
		margin: 0;
		inset: auto;
	}
</style>
