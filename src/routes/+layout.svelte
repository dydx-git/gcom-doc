<script lang="ts">
    import "carbon-components-svelte/css/all.css";
    import {
      Header,
      HeaderUtilities,
      HeaderAction,
      HeaderGlobalAction,
      HeaderPanelLinks,
      HeaderPanelDivider,
      HeaderPanelLink,
      SkipToContent,
      Content,
      Grid,
      Theme,
	    HeaderNavItem,
      HeaderNav
    } from "carbon-components-svelte";
    import SettingsAdjust from "carbon-icons-svelte/lib/SettingsAdjust.svelte";
    import UserAvatarFilledAlt from "carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte";
	  import type { CarbonTheme } from "carbon-components-svelte/types/Theme/Theme.svelte";
    import navbarData from "$lib/data/nav/nav-menu";
    
    let theme: CarbonTheme = "g10";

    let isOpen1 = false;
    let isOpen2 = false;

    let navBarBtns = navbarData.navButtons;
  </script>

    <Theme bind:theme persist persistKey="__carbon-theme" />
  
  <Header company="IBM" platformName="Carbon Svelte">
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
      <HeaderAction
        bind:isOpen={isOpen1}
        icon={UserAvatarFilledAlt}
        closeIcon={UserAvatarFilledAlt}
      >
        <HeaderPanelLinks>
          <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
          <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
          <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
          <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
          <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
          <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
          <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
          <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
          <HeaderPanelDivider>Switcher subject 3</HeaderPanelDivider>
          <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
        </HeaderPanelLinks>
      </HeaderAction>
      <HeaderAction bind:isOpen={isOpen2}>
        <HeaderPanelLinks>
          <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
          <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
          <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
          <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
          <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
          <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
          <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
          <HeaderPanelLink>Switcher item 5</HeaderPanelLink>
        </HeaderPanelLinks>
      </HeaderAction>
    </HeaderUtilities>
  </Header>
  
  <Content>
    <Grid>
      <slot />
    </Grid>
  </Content>

  <style>
    :global(.default-gap) {
      padding-top: var(--cds-spacing-05);
    }
  </style>