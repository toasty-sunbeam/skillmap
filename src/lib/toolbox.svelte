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
	}
	.tool-button.selected {
		background: #2b7fff;
		font-weight: bold;
	}
</style>


<!-- TODO: Accessibility -->
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