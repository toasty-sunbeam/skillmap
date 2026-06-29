<script lang="ts">
	import Switch from './switch.svelte';
	import { inEditMode, setEditMode } from './state/edit-mode.svelte.js';
	import Icon from '@iconify/svelte';

	let { class: className }: { class?: string } = $props();
</script>

<div class="flex flex-row items-center" title="Edit mode">
	<Icon icon="lucide:edit" class="text-white w-6 h-6" />
	<Switch
		class={className}
		ariaLabel="Edit mode"
		checked={inEditMode()}
		descriptionOn="Edit mode is on. You can add and modify skills on the grid."
		descriptionOff="Edit mode is off."
		onchange={setEditMode}
	/>
</div>
