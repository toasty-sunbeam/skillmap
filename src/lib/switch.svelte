<script lang="ts">
	let {
		label,
		checked,
		description,
		descriptionOn,
		descriptionOff,
		onchange,
	}: {
		label: string;
		checked: boolean;
		description?: string;
		descriptionOn?: string;
		descriptionOff?: string;
		onchange?: (checked: boolean) => void;
	} = $props();

	const descriptionId = `switch-description-${crypto.randomUUID()}`;

	const activeDescription = $derived(
		description ?? (checked ? descriptionOn : descriptionOff) ?? undefined,
	);

	function toggle() {
		onchange?.(!checked);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === ' ') {
			event.preventDefault();
			toggle();
		}
	}
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	aria-describedby={activeDescription ? descriptionId : undefined}
	class="inline-flex cursor-pointer items-center gap-3 rounded-md border-0 bg-transparent p-1 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
	onclick={toggle}
	onkeydown={onKeydown}
>
	<span class="text-sm select-none">{label}</span>
	<span
		aria-hidden="true"
		class={[
			'relative block h-6 w-11 rounded-full transition-colors motion-reduce:transition-none',
			checked ? 'bg-blue-500' : 'bg-neutral-600',
		]}
	>
		<span
			class={[
				'absolute top-0.5 left-0.5 block h-5 w-5 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none',
				checked ? 'translate-x-5' : 'translate-x-0',
			]}
		></span>
	</span>
</button>
{#if activeDescription}
	<span id={descriptionId} class="sr-only">{activeDescription}</span>
{/if}
