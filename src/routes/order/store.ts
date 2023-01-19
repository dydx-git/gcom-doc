import { persisted } from 'svelte-local-storage-store';

export const showRecordsForLastDays = persisted('showRecordsForLastDays', 40);
