<script lang="ts">
	import { ClickableTile, Tile } from 'carbon-components-svelte';

	type clickHandlerFunction = (...args: string[]) => void;

	export let text = 'Default Text';
	export let highlight = '0';
	export let clickHandler: clickHandlerFunction | null = null;
</script>

{#if clickHandler}
	<ClickableTile>
		{text}
		<span class="cds--type-heading-06 highlight success">
			{highlight}
		</span>
	</ClickableTile>
{:else}
	<Tile>
		{text}
		<span class="cds--type-heading-06 highlight success">
			{highlight}
		</span>
	</Tile>
{/if}

<style>
	.highlight {
		float: right;
	}
	.success {
		color: var(--cds-support-success-inverse);
	}
</style>
