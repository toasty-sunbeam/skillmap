<script lang="ts">
	import { GRID_SNAP } from './skill-draggable.js';
	import { panzoomTransform } from './state/panzoom.svelte.js';

	let {
		snapSize = GRID_SNAP,
		subdivisions = 5,
		backgroundColor = '#141414',
		minorLineColor = '#2e2e2e',
		majorLineColor = '#3d3d3d'
	}: {
		snapSize?: number;
		subdivisions?: number;
		backgroundColor?: string;
		minorLineColor?: string;
		majorLineColor?: string;
	} = $props();

	const tileSize = $derived(snapSize * subdivisions);

	// Render in screen space so 1px lines stay crisp at every zoom level.
	const minorSize = $derived(snapSize * panzoomTransform.scale);
	const majorSize = $derived(tileSize * panzoomTransform.scale);

	const gridStyle = $derived(
		[
			`background-color: ${backgroundColor}`,
			`background-image:` +
				`linear-gradient(${minorLineColor} 1px, transparent 1px),` +
				`linear-gradient(90deg, ${minorLineColor} 1px, transparent 1px),` +
				`linear-gradient(${majorLineColor} 1px, transparent 1px),` +
				`linear-gradient(90deg, ${majorLineColor} 1px, transparent 1px)`,
			`background-size:` +
				`${minorSize}px ${minorSize}px,` +
				`${minorSize}px ${minorSize}px,` +
				`${majorSize}px ${majorSize}px,` +
				`${majorSize}px ${majorSize}px`,
			`background-position:` +
				`${panzoomTransform.x}px ${panzoomTransform.y}px,` +
				`${panzoomTransform.x}px ${panzoomTransform.y}px,` +
				`${panzoomTransform.x}px ${panzoomTransform.y}px,` +
				`${panzoomTransform.x}px ${panzoomTransform.y}px`
		].join(';')
	);
</script>

<div
	class="pointer-events-none absolute inset-0"
	style={gridStyle}
	aria-hidden="true"
></div>
