<script>
	import 'carbon-components-svelte/css/all.css';
	import { Content, Header } from 'carbon-components-svelte';
</script>

<Header company="Thread Tapes" platformName="DOC" href="/login" />

<Content>
	<slot />
</Content>

<style>
	:global(.default-gap) {
		padding-top: var(--cds-spacing-05);
	}
</style>
