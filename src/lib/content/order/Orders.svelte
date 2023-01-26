<script lang="ts">
	import HighlightTile from '$lib/components/HighlightTile.svelte';
	import { orderColumns, orderDatatableColumnKeys } from '$lib/data/datatable/order';
	import { getRelativeTime } from '$lib/utils/relativeTime';
	import {
		Grid,
		Column,
		Row,
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Button,
		Truncate,
		Tag,
		OverflowMenu,
		OverflowMenuItem,
		Breakpoint
	} from 'carbon-components-svelte';
	import type { BreakpointSize } from 'carbon-components-svelte/types/Breakpoint/breakpoints';
	import type { DataTableCell } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import { Add, type CarbonIcon, Renew, Time, Train, Unknown } from 'carbon-icons-svelte';
	import type { OrderDataTable } from '../core';

	export let title = 'Orders';
	export let description = "Showing orders from 01 Jan'";

	export let tableData: OrderDataTable[] = [];

	let dtColumns = orderColumns;
	let screenSize: BreakpointSize;

	const filterTable = (text: string) => {};

	const render = (cell: DataTableCell) => {
		switch (cell.key) {
			case orderDatatableColumnKeys.price:
				return `$${cell.value}`;
			case orderDatatableColumnKeys.date:
				return getRelativeTime(new Date(cell.value));
			default:
				return cell.value;
		}
	};

	const getIconByStatus: (status: string) => typeof CarbonIcon = (status: string) => {
		switch (status.toLowerCase()) {
			case 'pending':
				return Time;
			case 'overdue':
				return Train;
			default:
				return Unknown;
		}
	};

	$: if (screenSize == 'sm') {
		dtColumns = orderColumns.filter((column) =>
			[orderDatatableColumnKeys.name, orderDatatableColumnKeys.status].includes(column.key)
		);
	}
</script>

<Breakpoint bind:size={screenSize} />

<Grid>
	<Row>
		<Column sm={4} md={4} lg={4}>
			<HighlightTile text="New orders today" highlight="24" />
		</Column>
		<Column sm={0} md={4} lg={4}>
			<HighlightTile
				clickHandler={() => filterTable('pending digitizing')}
				text="Pending digitizing:"
				highlight="14"
			/>
		</Column>
		<Column sm={0} md={4} lg={4}>
			<HighlightTile
				clickHandler={() => filterTable('pending vector')}
				text="Pending vector:"
				highlight="10"
			/>
		</Column>
		<Column sm={0} md={4} lg={4}>
			<HighlightTile clickHandler={() => filterTable('overdue')} text="Overdue:" highlight="10" />
		</Column>
	</Row>
	<Row class="default-gap">
		<Column>
			<DataTable sortable headers={dtColumns} rows={tableData} stickyHeader={screenSize == 'sm'}>
				<strong slot="title">{title}</strong>
				<span slot="description" style="font-size: 1rem">
					{description}
				</span>
				<svelte:fragment slot="cell" let:row let:cell>
					{#if cell.key === orderDatatableColumnKeys.status}
						<Tag interactive icon={getIconByStatus(row.status)} type="blue">
							{row.status}
						</Tag>
					{:else if cell.key === orderDatatableColumnKeys.actions}
						<OverflowMenu flipped>
							<OverflowMenuItem text="Restart" />
							<OverflowMenuItem
								href="https://cloud.ibm.com/docs/loadbalancer-service"
								text="API documentation"
							/>
							<OverflowMenuItem danger text="Stop" />
						</OverflowMenu>
					{:else}
						<Truncate>
							{render(cell)}
						</Truncate>
					{/if}
				</svelte:fragment>

				<Toolbar>
					<ToolbarContent>
						<ToolbarSearch />
						<Button icon={Renew} kind="secondary" iconDescription="Refresh" />
						<Button icon={Add} accesskey="n">Create New</Button>
					</ToolbarContent>
				</Toolbar>
			</DataTable>
		</Column>
	</Row>
</Grid>
