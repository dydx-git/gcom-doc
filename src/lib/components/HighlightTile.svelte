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
		<span class="highlight success" style="margin-top: -0.45rem">
			{highlight}
		</span>
	</ClickableTile>
{:else}
	<Tile>
		{text}
		<span class="highlight success">
			{highlight}
		</span>
	</Tile>
{/if}

<style>
	.highlight {
		font-size: 3rem;
		float: right;
	}
	.success {
		color: var(--cds-support-success-inverse);
	}
</style>
