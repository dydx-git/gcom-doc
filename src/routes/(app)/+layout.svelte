<script lang="ts">
	import '../base.scss';
	import './app.scss';
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		SkipToContent,
		Content,
		Grid,
		Theme,
		HeaderNavItem,
		HeaderNav,
		Breakpoint,
		HeaderPanelLink,
		HeaderPanelDivider,
		HeaderGlobalAction
	} from 'carbon-components-svelte';
	import type { BreakpointSize } from 'carbon-components-svelte/types/Breakpoint/breakpoints';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
	import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';
	import navbarData from '$lib/components/data/nav/nav-menu';
	import { Client } from '@ghostebony/sse/client';

	import { onMount } from 'svelte';
	import { screenSizeStore } from '$lib/store';
	import type { LayoutData } from './$types';
	import { PUBLIC_SSE_CHANNEL } from '$env/static/public';
	import { IbmCloud, UserAvatar } from 'carbon-icons-svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';

	export let data: LayoutData;

	let theme: CarbonTheme = 'g10';

	let navBarBtns = navbarData.navButtons;

	let screenSize: BreakpointSize = 'lg';

	let eventSource: Client;

	onMount(async () => {
		eventSource = new Client({
			source: {
				url: `/api/sse`
			},
			listeners: [
				{
					channel: PUBLIC_SSE_CHANNEL,
					listener: ({ data }) => {
						console.log(data);
					},
					parseJson: true
				}
			]
		});

		return () => {
			eventSource.close();
		};
	});
</script>

<Theme bind:theme="{theme}" persist persistKey="__carbon-theme" />

<Breakpoint bind:size="{screenSize}" on:change="{(e) => screenSizeStore.set(screenSize)}" />

<Header company="Thread Tapes" platformName="DOC">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
		{#each navBarBtns as btn}
			<HeaderNavItem href="{btn.path}" text="{btn.name}" data-sveltekit-preload-data="hover" />
		{/each}
	</HeaderNav>
	<HeaderUtilities>
		<HeaderGlobalAction aria-label="Settings" icon="{IbmCloud}" />
		<HeaderAction icon="{UserAvatarFilledAlt}" closeIcon="{UserAvatar}">
			<HeaderPanelLinks>
				<HeaderPanelDivider>Signed in as {data.salesRep?.name}</HeaderPanelDivider>
				<HeaderPanelLink>Table page size</HeaderPanelLink>
				<HeaderPanelLink>Auto Approval</HeaderPanelLink>
				<HeaderPanelDivider>Access Control</HeaderPanelDivider>
				<HeaderPanelLink href="/api/logout">Log out</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<Content id="main-content">
	<Grid>
		<PageTransition pathname="{data.pathname}">
			<slot />
		</PageTransition>
	</Grid>
</Content>

<style>
	:global(.bx--data-table--sticky-header) {
		max-height: 76vh !important;
	}
	:global(.bx--form) {
		height: 100%;
	}
	:global(.bx--modal-content--with-form) {
		margin-bottom: 0px;
		height: 64vh;
	}
	:global(.mobile-form) {
		height: 76vh;
	}
	:global(html, body) {
		max-width: 100%;
		overflow-x: hidden;
	}
</style>
