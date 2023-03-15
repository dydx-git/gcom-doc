import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';

export const orderDatatableColumnKeys = {
	name: 'name',
	price: 'price',
	client: 'client',
	vendor: 'vendor',
	date: 'date',
	status: 'status',
	actions: 'actions'
};

export const orderColumns: ReadonlyArray<DataTableHeader> = [
	{ key: orderDatatableColumnKeys.name, value: 'Name' },
	{ key: orderDatatableColumnKeys.price, value: 'Price' },
	{ key: orderDatatableColumnKeys.client, value: 'Client' },
	{ key: orderDatatableColumnKeys.vendor, value: 'Vendor' },
	{ key: orderDatatableColumnKeys.date, value: 'Created On' },
	{ key: orderDatatableColumnKeys.status, value: 'Status' },
	{ key: orderDatatableColumnKeys.actions, value: 'Actions', sort: false, width: '5rem' }
];
