import { userPreferences, type UserSettings } from '$lib/settings';
import type { BreakpointSize } from 'carbon-components-svelte/types/Breakpoint/breakpoints';
import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const userPreferencesStore = persisted<UserSettings>('userPreferences', userPreferences);
export const screenSizeStore = writable<BreakpointSize>('max');
