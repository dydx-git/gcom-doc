<script lang="ts">
	import HighlightTile from '$lib/components/HighlightTile.svelte';
	import clientColumns from '$lib/data/datatable/client';
	import type { Client } from '@prisma/client';
	import {
		Grid,
		Column,
		Row,
		ClickableTile,
		Tile,
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Button,
		Modal,
		ComposedModal,
		ModalHeader,
		ModalBody,
		Checkbox,
		ModalFooter,
		FormGroup,
		TextInput
	} from 'carbon-components-svelte';
	import { Add, Renew, UserFollow } from 'carbon-icons-svelte';

	export let title = 'Clients';
	export let description = 'Showing all clients';

	export let tableData: Client[] = [];

	let isSearchExpanded = true;
	let searchText = '';
	let isAddNewModalOpen = false;

	$: isNewOrderModalDataValid = false;

	const filterTable = (text: string) => {
		console.log('filtering table');
	};

	const openNewOrderModal = () => {
		isAddNewModalOpen = true;
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
		<Column sm={4} md={{ span: 4, offset: 6 }} lg={{ span: 4, offset: 6 }}>
			<HighlightTile text="New clients this month" highlight="4" />
		</Column>
	</Row>
	<Row class="default-gap">
		<Column>
			<DataTable sortable headers={clientColumns} rows={tableData} stickyHeader>
				<strong slot="title">{title}</strong>
				<span slot="description" style="font-size: 1rem">
					{description}
				</span>
				<svelte:fragment slot="cell" let:row let:cell />

				<Toolbar>
					<ToolbarContent>
						<ToolbarSearch bind:expanded={isSearchExpanded} accesskey="/" bind:value={searchText} />
						<Button icon={UserFollow} accesskey="n" on:click={openNewOrderModal}>Create New</Button>
					</ToolbarContent>
				</Toolbar>
			</DataTable>
		</Column>
	</Row>
</Grid>

<ComposedModal
	preventCloseOnClickOutside
	size="sm"
	bind:open={isAddNewModalOpen}
	selectorPrimaryFocus="#name"
	on:open
	on:close
	on:submit
>
	<ModalHeader label="Create New" title="Client" />
	<ModalBody hasForm>
		<Row>
			<Column sm={12} md={6} lg={6}>
				<TextInput id="name" labelText="Name" placeholder="Client Name" />
			</Column>
			<Column sm={12} md={6} lg={6}>
				<TextInput id="name" labelText="Company" placeholder="Company Name" />
			</Column>
		</Row>
	</ModalBody>
	<ModalFooter
		primaryButtonText="Proceed"
		primaryButtonDisabled={isNewOrderModalDataValid}
		secondaryButtonText="Cancel"
		on:click:button--secondary={closeNewOrderModal}
	/>
</ComposedModal>
