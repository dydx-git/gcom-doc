<script lang="ts">
	import { page } from '$app/stores';

	const error = $page.error as App.Error;
</script>

<h2>{error.code}: {error?.message ?? error?.messages}</h2>

{#if error.code == 401}
	Please go back to the <a href="/">homepage</a>
{/if}
