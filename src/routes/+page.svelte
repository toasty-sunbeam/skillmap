<script lang="ts">
	import Grid from '$lib/grid.svelte';
    import Zoom from '$lib/zoom.svelte';
	import { inEditMode, toggleEditMode } from '$lib/state/edit-mode.svelte.js';
	import SkillEditor from '$lib/skill-editor.svelte';
	
</script>

<h1 class="text-xl text-center">Talent tree</h1>

<main class="h-[calc(100vh-4rem)] overflow-hidden">
	<button onclick={toggleEditMode}>{inEditMode() ? 'Stop editing skills' : 'Edit skills'}</button>
	<Zoom>
		<Grid />
	</Zoom>
	<SkillEditor/>
</main>