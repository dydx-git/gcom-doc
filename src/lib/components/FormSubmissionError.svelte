<script lang="ts">
	import type { FormStatusMessage } from '$lib/modules/common/interfaces/form';
	import { InlineNotification } from 'carbon-components-svelte';

	export let error: FormStatusMessage | null = null;
</script>

{#if error}
	<InlineNotification
		lowContrast
		title="{error?.status.toString() || 'Error'}"
		subtitle="{error.message}"
		timeout="{8000}"
		on:close="{() => (error = null)}" />
{/if}
