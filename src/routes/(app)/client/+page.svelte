<script lang="ts">
	import HighlightTile from '$lib/components/HighlightTile.svelte';
	import clientColumns from './columns';
	import { FormSubmitType } from './meta';
	import type { Client } from '@prisma/client';
	import {
		Grid,
		Column,
		Row,
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Button
	} from 'carbon-components-svelte';
	import { UserFollow } from 'carbon-icons-svelte';
	import ClientForm from './ClientForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	export let title = 'Clients';
	export let description = 'Showing all clients';
	export let tableData: Client[] = [];

	console.log('data', tableData);

	let isSearchExpanded = true;
	let searchText = '';
	let isAddNewModalOpen = false;
	let submitType: FormSubmitType = FormSubmitType.AddNew;

	const filterTable = (text: string) => {
		console.log('filtering table');
	};

	const openNewOrderModal = () => {
		isAddNewModalOpen = true;
		submitType = FormSubmitType.AddNew;
	};

	const closeNewOrderModal = () => {
		isAddNewModalOpen = false;
	};

	$: if (searchText.length > 1) {
		filterTable(searchText);
	}
</script>

<Grid>
	<Row>
		<Column sm="{4}" md="{{ span: 4, offset: 2 }}" lg="{{ span: 6, offset: 5 }}">
			<HighlightTile text="New clients this month" highlight="4" />
		</Column>
	</Row>
	<Row class="default-gap">
		<Column>
			<DataTable sortable headers="{clientColumns}" rows="{tableData}" stickyHeader>
				<strong slot="title">{title}</strong>
				<span slot="description" style="font-size: 1rem">
					{description}
				</span>
				<svelte:fragment slot="cell" let:row let:cell />

				<Toolbar>
					<ToolbarContent>
						<ToolbarSearch
							bind:expanded="{isSearchExpanded}"
							accesskey="/"
							bind:value="{searchText}"
						/>
						<Button icon="{UserFollow}" accesskey="n" on:click="{openNewOrderModal}"
							>Create New</Button
						>
					</ToolbarContent>
				</Toolbar>
			</DataTable>
		</Column>
	</Row>
</Grid>

<ClientForm bind:open="{isAddNewModalOpen}" bind:submitType="{submitType}" data="{data}" />
