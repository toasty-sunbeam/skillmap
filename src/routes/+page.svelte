<script lang="ts">
	import Grid from '$lib/grid.svelte';
	import GridBackground from '$lib/grid-background.svelte';
	import Zoom from '$lib/zoom.svelte';
	import EditModeSwitch from '$lib/edit-mode-switch.svelte';
	import SkillEditor from '$lib/skill-editor.svelte';	
	import { DEFAULT_TREE_NAME, setTreeName } from '$lib/state/metadata';
	import { metadata } from '$lib/state/document';
	import { useYjsKey } from '$lib/yjs.svelte';
	import { inEditMode } from '$lib/state/edit-mode.svelte';

	const treeName = useYjsKey<string>(() => metadata, 'name', DEFAULT_TREE_NAME);

	function saveTreeName() {
		setTreeName(treeName.value.trim());
	}

	// Tools
	const TOOLS = [
		{ id: 'add-skill', label: 'Add skill' },
		{ id: 'edit-skill', label: 'Edit skill' },
		{ id: 'delete-skill', label: 'Delete skill' },
		{ id: 'connect-skills', label: 'Connect skills' },
	] as const;
	type ToolId = (typeof TOOLS)[number]['id'];
	let selectedTool: ToolId = $state('add-skill');
</script>

<style>
	.tool-button {
		border-radius: 3px;
	}
	.tool-button.selected {
		background: #2b7fff;
		font-weight: bold;
	}
</style>

<main class="relative h-dvh overflow-hidden bg-[#141414]">
	<GridBackground />
	<Zoom>
		<Grid />
	</Zoom>
	<div class="flex flex-row justify-between absolute top-0 left-0 right-0 bg-gray-800/50">
		<EditModeSwitch />
		<input
			bind:value={treeName.value}
			onchange={saveTreeName}
			onkeydown={(event) => {
				if (event.key === 'Enter') {
					event.currentTarget.blur();
				}
			}}
			class="text-white text-center cursor-pointer place-self-center"
		/>
		<div class="w-48"></div>
	</div>
	{#if inEditMode()}
		<!-- TODO: Accessibility -->
		<!-- TODO: Extract to toolbox component -->
		<div class="flex flex-col absolute top-8 left-1 text-white border border-white rounded-sm px-2 py-1">
			{#each TOOLS as tool}
				<button
					class="tool-button"
					class:selected={selectedTool === tool.id}
					onclick={() => selectedTool = tool.id}
				>
					{tool.label}
				</button>
			{/each}
		</div>
	{/if}
	<SkillEditor/>
</main>