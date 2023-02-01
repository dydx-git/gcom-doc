import { writable } from 'svelte/store';
import type { OrderFormData } from '../core';

export const orderFormDataStore = writable<OrderFormData | null>(null);
export const keepOrderDataOnCloseStore = writable(false);
