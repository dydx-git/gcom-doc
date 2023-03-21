<script>
	import { dev } from '$app/environment';
	import { Content, Header, HeaderActionLink, HeaderUtilities } from 'carbon-components-svelte';
	import { FaceActivatedAdd, Login } from 'carbon-icons-svelte';
	import '../base.scss';
</script>

<Header company="Thread Tapes" platformName="DOC" href="/login">
	<HeaderUtilities>
		{#if dev}
			<HeaderActionLink aria-label="Login" href="/login" icon="{Login}" textContent="Login" />
			<HeaderActionLink
				aria-label="Register"
				href="/register"
				textContent="Register"
				icon="{FaceActivatedAdd}"
			/>
		{/if}
	</HeaderUtilities>
</Header>

<Content>
	<slot />
</Content>

<style>
	:global(.default-gap) {
		padding-top: var(--cds-spacing-05);
	}
</style>
