import type { ClientFormData } from '$lib/interfaces/form';
import { writable } from 'svelte/store';

export const clientFormDataStore = writable<ClientFormData | null>(null);
export const keepClientDataOnCloseStore = writable(false);
