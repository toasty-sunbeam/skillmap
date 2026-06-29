<script lang="ts">
	import Switch from './switch.svelte';
	import { inEditMode, setEditMode } from './state/edit-mode.svelte.js';

	let { class: className }: { class?: string } = $props();
</script>

<Switch
	class={className}
	label="Edit skills"
	checked={inEditMode()}
	descriptionOn="Edit mode is on. You can add and modify skills on the grid."
	descriptionOff="Edit mode is off."
	onchange={setEditMode}
/>
