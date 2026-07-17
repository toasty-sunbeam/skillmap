<script module lang="ts">
	const TOOLS = [
		{ id: 'add-skill', label: 'Add skill' },
		{ id: 'edit-skill', label: 'Edit skill' },
		{ id: 'delete-skill', label: 'Delete skill' },
		{ id: 'connect-skills', label: 'Connect skills' },
	] as const;
	export type ToolId = (typeof TOOLS)[number]['id'];
</script>
<script lang="ts">
	let { selectedTool = $bindable<ToolId>('add-skill') }: { selectedTool?: ToolId } = $props();
</script>

<style>
	.tool-button {
		border-radius: 3px;
		padding: 0 .5em;
	}
	.tool-button.selected {
		background: #2b7fff;
		font-weight: bold;
	}
</style>

<fieldset class="flex flex-col absolute top-8 left-1 bg-black text-white border border-white rounded-sm px-1 py-1 min-w-35">
	<legend class="sr-only">Editing tools</legend>
	{#each TOOLS as tool}
		<label class="tool-button" class:selected={selectedTool === tool.id}>
			<input
				type="radio"
				class="sr-only"
				bind:group={selectedTool}
				value={tool.id}
			/>
			{tool.label}
		</label>
	{/each}
</fieldset>
