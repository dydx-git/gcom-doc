export interface DataTableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    searchable?: boolean;
    isHidden?: boolean;
}

export interface DataTableRow {
    id: string;
    columnKey: string;
    data: object;
}