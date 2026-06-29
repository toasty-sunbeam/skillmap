<script lang="ts">
	import Grid from '$lib/grid.svelte';
    import Zoom from '$lib/zoom.svelte';
	import EditModeSwitch from '$lib/edit-mode-switch.svelte';
	import SkillEditor from '$lib/skill-editor.svelte';	
	import { DEFAULT_TREE_NAME, setTreeName } from '$lib/state/metadata';
	import { metadata } from '$lib/state/document';
	import { useYjsKey } from '$lib/yjs.svelte';

	const treeName = useYjsKey<string>(() => metadata, 'name', DEFAULT_TREE_NAME);

	function saveTreeName() {
		setTreeName(treeName.value.trim());
	}
</script>

<main class="relative h-dvh overflow-hidden">
	<Zoom>
		<Grid />
	</Zoom>
	<div class="flex flex-row justify-between absolute top-0 left-0 right-0 bg-gray-800/50">
		<div class="w-48"></div>
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
		<EditModeSwitch />
	</div>
	<SkillEditor/>
</main>