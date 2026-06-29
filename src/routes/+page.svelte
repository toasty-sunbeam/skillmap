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

<h1 class="text-xl text-center">{treeName.value}</h1>
<input 
	bind:value={treeName.value}
	onchange={saveTreeName}
	onkeydown={(event) => {
		if (event.key === 'Enter') {
			event.currentTarget.blur();
		}
	}}
	class="border"
/>

<main class="h-[calc(100vh-4rem)] overflow-hidden">
	
	<div class="relative">
		<Zoom>
			<Grid />
		</Zoom>
		<EditModeSwitch class="absolute top-0 right-0"/>
	</div>
	<SkillEditor/>
</main>