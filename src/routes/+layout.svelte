<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
</script>

<slot />

<style>
	:global(.default-gap) {
		padding-top: var(--cds-spacing-05);
	}
</style>
