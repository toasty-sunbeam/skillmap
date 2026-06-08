<script lang="ts">
	let points = $state(0);
	let maxPoints = $state(1);
	let icon = $state();
	let name = $state('Skill 1');

	function handleClick() {
	}
	function handleRightClick(event: MouseEvent) {
		event.preventDefault();
	}
</script>

<button onclick={handleClick} oncontextmenu={handleRightClick} class="border border-red-500" popovertarget="skill-editor">
	<div>{name}</div>
	<div>{points}/{maxPoints}</div>
</button>