<script lang="ts">
	import { ClickableTile, Tile } from 'carbon-components-svelte';

	type clickHandlerFunction = (e: MouseEvent, ...args: string[]) => void;

	export let text = 'Default Text';
	export let highlight = '0';
	export let clickHandler: clickHandlerFunction | null = null;

	type type = 'success' | 'error' | 'warning' | 'info';
	export let type: type = 'success';
</script>

{#if clickHandler}
	<ClickableTile on:click="{clickHandler}">
		{text}
		<span class="cds--type-heading-06 highlight {type}">
			{highlight}
		</span>
	</ClickableTile>
{:else}
	<Tile>
		{text}
		<span class="cds--type-heading-06 highlight {type}">
			{highlight}
		</span>
	</Tile>
{/if}

<style>
	.highlight {
		float: right;
	}
</style>
