<script lang="ts">
	import { InlineNotification } from 'carbon-components-svelte';

	export let error: Error | null = null;
</script>

{#if error}
	<InlineNotification
		lowContrast
		title="{error?.name || 'Error'}"
		subtitle="{error.message}"
		timeout="{8000}"
		on:close="{() => (error = null)}"
	/>
{/if}
