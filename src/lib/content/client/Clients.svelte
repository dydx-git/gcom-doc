<script lang="ts">
	import HighlightTile from '$lib/components/HighlightTile.svelte';
	import clientColumns from '$lib/data/datatable/client';
	import type { Client } from '@prisma/client';
	import { Grid, Column, Row, ClickableTile, Tile, DataTable } from 'carbon-components-svelte';

	export let title = 'Clients';
	export let description = 'Showing all clients';

	export let tableData: Client[] = [];

	const filterTable = (text: string) => {};
</script>

<Grid>
	<Row>
		<Column sm={4} md={{ span: 4, offset: 6 }} lg={{ span: 4, offset: 6 }}>
			<HighlightTile text="New clients this month" highlight="4" />
		</Column>
	</Row>
	<Row class="default-gap">
		<Column>
			<DataTable sortable headers={clientColumns} rows={tableData}>
				<strong slot="title">{title}</strong>
				<span slot="description" style="font-size: 1rem">
					{description}
				</span>
				<svelte:fragment slot="cell" let:row let:cell />
			</DataTable>
		</Column>
	</Row>
</Grid>
