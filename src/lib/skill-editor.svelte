<script lang="ts">
	import Icon from "@iconify/svelte";
	import { renameSkill } from "./state/skill";

	const MARGIN = 8;

	let dialog: HTMLDialogElement;
	let invoker: HTMLElement | null = null;

	function syncPosition() {
		if (!dialog || !invoker) return;

		const rect = invoker.getBoundingClientRect();
		let top = rect.bottom + MARGIN;
		let left = rect.left;

		const dialogHeight = dialog.offsetHeight;
		const dialogWidth = dialog.offsetWidth;

		if (dialogHeight > 0 && top + dialogHeight > window.innerHeight) {
			top = rect.top - dialogHeight - MARGIN;
		}

		if (dialogWidth > 0 && left + dialogWidth > window.innerWidth) {
			left = window.innerWidth - dialogWidth - MARGIN;
		}

		if (left < MARGIN) {
			left = MARGIN;
		}

		dialog.style.top = `${top}px`;
		dialog.style.left = `${left}px`;
	}

	function onBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open' && event.source instanceof HTMLElement) {
			invoker = event.source;
			syncPosition();
			requestAnimationFrame(() => syncPosition());
			window.addEventListener('skillmap:panzoom', syncPosition);
			return;
		}

		if (event.newState === 'closed') {
			invoker = null;
			window.removeEventListener('skillmap:panzoom', syncPosition);
		}
	}
</script>

<dialog bind:this={dialog} id="skill-editor" popover="manual" onbeforetoggle={onBeforeToggle}>
	<div class="flex items-start justify-between gap-2">
		<p>Skill editor dialog</p>
		<button type="button" popovertarget="skill-editor" popovertargetaction="hide" class="border rounded-full">
			<Icon icon="lucide:x"/>
		</button>
	</div>

</dialog>

<style>
	#skill-editor {
		position: fixed;
		margin: 0;
		inset: auto;
	}
</style>
