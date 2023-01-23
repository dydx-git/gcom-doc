import { writable } from 'svelte/store';
import type { ClientFormData } from '../core';

export const clientFormDataStore = writable<ClientFormData | null>(null);
export const keepClientDataOnCloseStore = writable(false);
