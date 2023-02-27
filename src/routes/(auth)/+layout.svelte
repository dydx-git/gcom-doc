<script>
	import { dev } from '$app/environment';
	import {
		Content,
		Header,
		HeaderActionLink,
		HeaderNav,
		HeaderUtilities
	} from 'carbon-components-svelte';
	import { FaceActivatedAdd, Login } from 'carbon-icons-svelte';
	import 'carbon-components-svelte/css/all.css';
</script>

<Header company="Thread Tapes" platformName="DOC" href="/login">
	<HeaderNav>Taha</HeaderNav>
	<HeaderUtilities>
		{#if dev}
			<HeaderActionLink aria-label="Login" href="/login" icon={Login} textContent="Login" />
			<HeaderActionLink
				aria-label="Register"
				href="/register"
				textContent="Register"
				icon={FaceActivatedAdd}
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
