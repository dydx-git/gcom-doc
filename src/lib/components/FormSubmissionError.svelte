<script lang="ts">
	import { InlineNotification } from 'carbon-components-svelte';

	export let error: string | null = null;
</script>

{#if error}
	<InlineNotification
		lowContrast
		title="{'Error'}"
		subtitle="{error}"
		timeout="{8000}"
		on:close="{() => (error = null)}" />
{/if}
