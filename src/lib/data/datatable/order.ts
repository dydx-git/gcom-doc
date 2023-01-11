import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable.svelte";

const orderColumns : ReadonlyArray<DataTableHeader> = [
	{ key: 'id', value: 'ID'},
	{ key: 'name', value: 'Name' },
	{ key: 'price', value: 'Price' },
	{ key: 'client', value: 'Client' },
	{ key: 'vendor', value: 'Vendor' },
	{ key: 'date', value: 'Created On' },
	{ key: 'status', value: 'Status' },
	{ key: 'actions', value: 'Actions'  }
]


export default orderColumns;