<script lang="ts">
	import orderColumns from '$lib/data/datatable/order';
	import { Grid, Column, Row, ClickableTile, Tile, DataTable } from 'carbon-components-svelte';
	import type { DataTableRow } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';

	export let title = 'Orders';
	export let description = "Showing orders from 01 Jan'";

	export let tableData: DataTableRow[] = [
		{
			id: 'a',
			name: 'Load Balancer 3',
			protocol: 'HTTP',
			port: 3000,
			rule: 'Round robin'
		}
	];

	const filterTable = (text: string) => {};
</script>

<Grid>
	<Row>
		<Column sm={4} md={4} lg={4}>
			<Tile>27 orders received today</Tile>
		</Column>
		<Column sm={0} md={4} lg={4}>
			<ClickableTile on:click={() => filterTable('pending digitizing')}
				>Pending digitizing: 13</ClickableTile
			>
		</Column>
		<Column sm={0} md={4} lg={4}>
			<ClickableTile on:click={() => filterTable('pending vector')}
				>Pending vector: 14</ClickableTile
			>
		</Column>
		<Column sm={0} md={4} lg={4}>
			<ClickableTile on:click={() => filterTable('overdue')}>Overdue: 4</ClickableTile>
		</Column>
	</Row>
	<Row class="default-gap">
		<Column>
			<DataTable sortable headers={orderColumns} rows={tableData}>
				<strong slot="title">{title}</strong>
				<span slot="description" style="font-size: 1rem">
					{description}
				</span>
				<svelte:fragment slot="cell" let:row let:cell />
			</DataTable>
		</Column>
	</Row>
</Grid>
