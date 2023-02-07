import { userPreferences } from '$lib/data/settings';
import type { BreakpointSize } from 'carbon-components-svelte/types/Breakpoint/breakpoints';
import { persisted, writable } from 'svelte-local-storage-store';

export const userPreferencesStore = persisted('userPreferences', userPreferences);
export const screenSizeStore = writable<BreakpointSize>('screenSize', 'max');