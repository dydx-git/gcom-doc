import type { DataTableColumn } from "$lib/models/datatable";

const orderColumns : DataTableColumn[] = [
	{ key: 'id', label: 'ID', sortable: true, searchable: true },
	{ key: 'name', label: 'Name', sortable: true, searchable: true },
	{ key: 'price', label: 'Price', sortable: true, searchable: true },
	{ key: 'client', label: 'Client', sortable: true, searchable: true },
	{ key: 'vendor', label: 'Vendor', sortable: true, searchable: true },
	{ key: 'date', label: 'Created On', sortable: true, searchable: true },
	{ key: 'status', label: 'Status', sortable: true, searchable: true },
	{ key: 'actions', label: 'Actions', sortable: false, searchable: false }
]


export default orderColumns;