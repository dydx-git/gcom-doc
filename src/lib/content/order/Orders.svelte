<script lang="ts">
	import Doctable from '$lib/components/datatable/Doctable.svelte';
    import { Grid, Column, Row, ClickableTile, Tile } from 'carbon-components-svelte';

    const filterTable = (text: string) => {
        
    }
</script>

<Grid>
	<Row>
		<Column sm={4} md={4} lg={4}>
			<Tile>27 orders received today</Tile>
		</Column>
		<Column sm={0} md={4} lg={4}>
			<ClickableTile on:click={() => filterTable("pending digitizing")}>Pending digitizing: 13</ClickableTile>
		</Column>
		<Column sm={0} md={4} lg={4}>
			<ClickableTile on:click={() => filterTable("pending vector")}>Pending vector: 14</ClickableTile>
		</Column>
		<Column sm={0} md={4} lg={4}>
			<ClickableTile on:click={() => filterTable("overdue")}>Overdue: 4</ClickableTile>
		</Column>
	</Row>
	<Row class="">
		<Column>
			<Doctable title="Orders" description="Showing orders from 01 Jan'" />
		</Column>
	</Row>
</Grid>
