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
		HeaderGlobalAction,
		InlineNotification,
		ToastNotification
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
	import { invalidate } from '$app/navigation';
	import { notificationStore } from './meta';
	import { fade, fly, slide } from 'svelte/transition';
	import { navigating, page } from '$app/stores';
	import { quintOut, expoOut } from 'svelte/easing';

	export let data: LayoutData;

	let theme: CarbonTheme = 'g10';

	let navBarBtns = navbarData.navButtons;

	let screenSize: BreakpointSize = 'lg';

	let eventSource: Client;

	onMount(() => {
		eventSource = new Client({
			source: {
				url: `/api/sse`
			},
			listeners: [
				{
					channel: PUBLIC_SSE_CHANNEL,
					listener: ({ data }) => {
						invalidate(data.path);
					},
					parseJson: true
				}
			]
		});
		$notificationStore = {
			type: 'success',
			title: 'Layout loaded successfully'
		};

		return () => {
			eventSource.close();
		};
	});

	$: if ($page.data.isPageLoaded) {
		$notificationStore = {
			type: 'success',
			title: 'Data loaded successfully'
		};
	}

	$: if ($navigating) {
		$notificationStore = {
			type: 'info',
			title: 'Loading data'
		};
	}
</script>

<Theme bind:theme persist persistKey="__carbon-theme" />

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
				<HeaderPanelDivider>Signed in as {data.user?.username}</HeaderPanelDivider>
				<HeaderPanelLink>Table page size</HeaderPanelLink>
				<HeaderPanelLink>Auto Approval</HeaderPanelLink>
				<HeaderPanelDivider>Access Control</HeaderPanelDivider>
				<HeaderPanelLink href="/api/logout">Log out</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

{#if $notificationStore}
	<div
		transition:fly="{{
			delay: 100,
			duration: 200,
			x: 400,
			opacity: 1
		}}">
		<ToastNotification
			lowContrast
			hideCloseButton
			style="position: absolute; right: 0; z-index: 1000; margin-top: 50px"
			kind="{$notificationStore.type}"
			title="{$notificationStore.title}"
			timeout="{3000}"
			on:close="{() => ($notificationStore = null)}"
			subtitle="{$notificationStore?.message ?? ''}" />
	</div>
{/if}
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
	:global(.full-screen-form) {
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
