import type { ClientEmailOptionalDefaults, ClientPhoneOptionalDefaults } from '$lib/prisma/zod';
import type { DataTableHeader } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';

export const clientDatatableColumnKeys = {
    name: 'name',
    salesRep: 'salesRep',
    email: 'emails',
    phone: 'phones',
    address: 'clientAddress',
    payMethod: 'payMethod',
    actions: 'actions'
};

export const clientColumns: ReadonlyArray<DataTableHeader> = [
    { key: clientDatatableColumnKeys.name, value: 'Name' },
    { key: clientDatatableColumnKeys.salesRep, value: 'Sales Rep', display: (salesRep) => salesRep.name },
    { key: clientDatatableColumnKeys.email, value: 'Email', display: (emails) => emails.map((email: ClientEmailOptionalDefaults) => email.email).join('/'), width: '16rem' },
    { key: clientDatatableColumnKeys.phone, value: 'Phone', display: (phones) => phones.map((phone: ClientPhoneOptionalDefaults) => phone.phone).join('/') },
    { key: clientDatatableColumnKeys.address, value: 'Address', display: (address) => `${address.address}, ${address.city}, ${address.state} ${address.zip}`, width: '20rem' },
    { key: clientDatatableColumnKeys.payMethod, value: 'Pay Method' },
    { key: clientDatatableColumnKeys.actions, value: 'Actions', sort: false, width: '5rem' }
]