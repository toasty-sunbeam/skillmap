<script lang="ts">
	import Grid from '$lib/grid.svelte';
    import Zoom from '$lib/zoom.svelte';
	import EditModeSwitch from '$lib/edit-mode-switch.svelte';
	import SkillEditor from '$lib/skill-editor.svelte';	
</script>

<h1 class="text-xl text-center">Talent tree</h1>

<main class="h-[calc(100vh-4rem)] overflow-hidden">
	<div class="relative">
		<Zoom>
			<Grid />
		</Zoom>
		<EditModeSwitch class="absolute top-0 right-0"/>
	</div>
	<SkillEditor/>
</main>