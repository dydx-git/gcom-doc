import type { ClientEmailOptionalDefaults, ClientPhoneOptionalDefaults } from '$lib/zod-prisma';
import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';

export const clientDatatableColumnKeys = {
    name: 'name',
    salesRep: 'salesRep',
    email: 'emails',
    phone: 'phones',
    address: 'address',
    payMethod: 'payMethod',
    actions: 'actions'
};

export const clientColumns: ReadonlyArray<DataTableHeader> = [
    { key: clientDatatableColumnKeys.name, value: 'Name' },
    { key: clientDatatableColumnKeys.salesRep, value: 'Sales Rep' },
    { key: clientDatatableColumnKeys.email, value: 'Email', display: (emails) => emails.map((email: ClientEmailOptionalDefaults) => email.email).join('/') },
    { key: clientDatatableColumnKeys.phone, value: 'Phone', display: (phones) => phones.map((phone: ClientPhoneOptionalDefaults) => phone.phone).join('/') },
    { key: clientDatatableColumnKeys.address, value: 'Address', display: (address) => `${address?.street}, ${address?.city}, ${address?.state} ${address?.zip}` },
    { key: clientDatatableColumnKeys.payMethod, value: 'Pay Method' },
    { key: clientDatatableColumnKeys.actions, value: 'Actions', sort: false, width: '5rem' }
]