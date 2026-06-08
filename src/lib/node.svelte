<script lang="ts">
	let points = $state(0);
	let maxPoints = $state(1);
	let icon = $state();
	let name = $state('Skill 1');

	function handleClick() {
		if (points < maxPoints) {
			points++;
		}
	}
	function handleRightClick(event: MouseEvent) {
		if (points > 0) {
			points--;
		}
		event.preventDefault();
	}
</script>

<button onclick={handleClick} oncontextmenu={handleRightClick}>
	<div>{name}</div>
	<div>{points}/{maxPoints}</div>
</button>