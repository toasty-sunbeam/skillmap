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

<main class="relative h-full overflow-hidden">
	<Zoom>
		<Grid />
	</Zoom>
	<input 
		bind:value={treeName.value}
		onchange={saveTreeName}
		onkeydown={(event) => {
			if (event.key === 'Enter') {
				event.currentTarget.blur();
			}
		}}
		class="absolute top-0 left-1/2 -translate-x-1/2 text-white text-center cursor-pointer"
	/>
	<EditModeSwitch class="absolute top-0 right-0"/>
	<SkillEditor/>
</main>