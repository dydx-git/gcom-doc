<script lang="ts">
	import HighlightTile from '$lib/components/HighlightTile.svelte';
	import orderColumns from '$lib/data/datatable/order';
	import type { Order } from '$lib/models/job';
	import {
		Grid,
		Column,
		Row,
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		ToolbarMenu,
		ToolbarMenuItem,
		Button
	} from 'carbon-components-svelte';
	import { Add, Renew } from 'carbon-icons-svelte';

	export let title = 'Orders';
	export let description = "Showing orders from 01 Jan'";

	export let tableData: Order[] = [];

	const filterTable = (text: string) => {};
</script>

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
			<DataTable sortable headers={orderColumns} rows={tableData} stickyHeader>
				<strong slot="title">{title}</strong>
				<span slot="description" style="font-size: 1rem">
					{description}
				</span>
				<svelte:fragment slot="cell" let:row let:cell />

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
