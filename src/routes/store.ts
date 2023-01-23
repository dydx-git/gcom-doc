import { userPreferences } from '$lib/data/settings';
import { persisted } from 'svelte-local-storage-store';

export const userPreferencesStore = persisted('userPreferences', userPreferences);
