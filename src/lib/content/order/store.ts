import type { OrderFormData } from '$lib/interfaces/form';
import { writable } from 'svelte/store';

export const orderFormDataStore = writable<OrderFormData | null>(null);
export const keepOrderDataOnCloseStore = writable(false);
