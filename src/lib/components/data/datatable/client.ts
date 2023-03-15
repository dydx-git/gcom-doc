import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';

const clientColumns: ReadonlyArray<DataTableHeader> = [
	{ key: 'name', value: 'Name' },
	{ key: 'phone', value: 'Phone' },
	{ key: 'email', value: 'Email' },
	{ key: 'employee', value: 'Employee' },
	{ key: 'actions', value: 'Actions', sort: false }
];

export default clientColumns;
