<script lang="ts">
	import Grid from '$lib/grid.svelte';
    import Zoom from '$lib/zoom.svelte';
	import { inEditMode, toggleEditMode } from '$lib/state/edit-mode.svelte.js';
	import SkillEditor from '$lib/skill-editor.svelte';
	import { addSkill, clearSkills, moveSkill } from '$lib/state/skill';
	
	function newSkill(event: MouseEvent) {
		addSkill(1, 1);
	}
</script>

<h1 class="text-xl text-center">Talent tree</h1>

<main class="h-[calc(100vh-4rem)] overflow-hidden">
	<button onclick={newSkill}>New skill</button>
	<button onclick={toggleEditMode}>{inEditMode() ? 'Stop editing skills' : 'Edit skills'}</button>
	<button onclick={clearSkills}>Clear skills</button>
	<Zoom>
		<Grid />
	</Zoom>
	<SkillEditor/>
</main>