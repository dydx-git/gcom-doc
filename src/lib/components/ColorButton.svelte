<script lang="ts">
	// The background color for this diamond
	// var(--color) CSS variable
	export let selected = false;

	// The fuzzy border is made of circles, in each edge there are
	// `circlesPerEdge` on it with random radiuses:
	const circlesPerEdge = 64;
	// The random seed used every 4 circles (one per edge)
	let seeds: Array<number> = [];
	for (let i = 0; i < circlesPerEdge; ++i) {
		seeds.push(Math.random());
	}
	// Maximum radius of each circle used to make the fuzzy border
	const maxR = 4;
</script>

<svg viewBox="0 0 64 64" aria-hidden="true" class={selected ? 'selected' : ''}>
	<rect x={4} y={4} width="56" height="56" />
	{#each seeds as rnd}
		<circle cy={4 + (maxR / 2) * rnd} cx={4 + 56 * Math.random()} r={maxR * rnd} />
		<circle cx={60 - (maxR / 2) * rnd} cy={4 + 56 * Math.random()} r={maxR * rnd} />
		<circle cx={4 + (maxR / 2) * rnd} cy={4 + 56 * Math.random()} r={maxR * rnd} />
		<circle cy={60 - (maxR / 2) * rnd} cx={4 + 56 * Math.random()} r={maxR * rnd} />
	{/each}
</svg>

<style>
	svg {
		transition: transform 100ms ease-in;
		fill: var(--color);
		width: var(--width);
		height: var(--height);
	}
	svg:hover {
		transform: scale(0.9);
		transition: transform 100ms ease-out;
	}
	svg.selected:hover,
	.selected {
		transform: scale(0.8);
		transition: transform 100ms ease-out;
	}
</style>
