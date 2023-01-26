<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../app.scss';
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderGlobalAction,
		HeaderPanelLinks,
		SkipToContent,
		Content,
		Grid,
		Theme,
		HeaderNavItem,
		HeaderNav
	} from 'carbon-components-svelte';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';
	import navbarData from '$lib/data/nav/nav-menu';

	let theme: CarbonTheme = 'g10';

	let isOpen1 = false;
	let isOpen2 = false;

	let navBarBtns = navbarData.navButtons;
</script>

<Theme bind:theme persist persistKey="__carbon-theme" />

<Header company="Thread Tapes" platformName="DOC">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
		{#each navBarBtns as btn}
			<HeaderNavItem href={btn.path} text={btn.name} />
		{/each}
	</HeaderNav>
	<HeaderUtilities>
		<HeaderGlobalAction aria-label="Settings" icon={SettingsAdjust} />
		<HeaderAction bind:isOpen={isOpen1} icon={UserAvatarFilledAlt} closeIcon={UserAvatarFilledAlt}>
			<HeaderPanelLinks />
		</HeaderAction>
		<HeaderAction bind:isOpen={isOpen2}>
			<HeaderPanelLinks />
		</HeaderAction>
	</HeaderUtilities>
</Header>

<Content id="main-content">
	<Grid>
		<slot />
	</Grid>
</Content>

<style>
	:global(.default-gap) {
		padding-top: var(--cds-spacing-05);
	}
	:global(.bx--data-table--sticky-header) {
		max-height: 76vh !important;
	}
</style>
