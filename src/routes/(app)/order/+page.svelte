<script lang="ts">
	import HighlightTile from '$lib/components/HighlightTile.svelte';
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
		TooltipDefinition,
		ComposedModal,
		ModalHeader,
		ModalBody,
		TextInput,
		ComboBox
	} from 'carbon-components-svelte';
	import FormSubmissionError from '$lib/components/FormSubmissionError.svelte';
	import type { DataTableCell } from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import type { TagProps } from 'carbon-components-svelte/types/Tag/Tag.svelte';
	import {
		Add,
		type CarbonIcon,
		Renew,
		Unknown,
		InProgressWarning,
		Checkmark,
		InProgress,
		IncompleteCancel,
		TrainSpeed,
		Edit
	} from 'carbon-icons-svelte';
	import dayjs from 'dayjs';
	import { screenSizeStore } from '$lib/store';
	import { orderColumns, orderDatatableColumnKeys } from './columns';
	import { superForm } from 'sveltekit-superforms/client';
	import { OrderStatus, type OrderDataTable, schema } from '$lib/modules/order/meta';
	import { FormSubmitType } from '../meta.js';
	import type { Snapshot } from '@sveltejs/kit';

	export let data;
	const { clients, orders } = data;
	export let title = 'Orders';
	export let description = "Showing orders from 01 Jan'";

	export let tableData = orders;

	let isAddNewModalOpen = false;
	let submitType: FormSubmitType = FormSubmitType.AddNew;
	let dtColumns = orderColumns;

	const filterTable = (text: string) => {};

	const render = (cell: DataTableCell) => {
		if (!cell.value) return '';

		switch (cell.key) {
			case orderDatatableColumnKeys.price:
				return `$${cell.value}`;
			case orderDatatableColumnKeys.date:
				return getRelativeTime(new Date(cell.value));
			case orderDatatableColumnKeys.status:
				return screenSize == 'sm' ? '' : cell.value;
			default:
				return cell.value;
		}
	};

	const getIconByStatus: (status: OrderStatus) => typeof CarbonIcon = (status: OrderStatus) => {
		switch (status) {
			case OrderStatus.PENDING:
				return InProgress;
			case OrderStatus.OVERDUE:
				return InProgressWarning;
			case OrderStatus.COMPLETED:
				return Checkmark;
			case OrderStatus.CANCELLED:
				return IncompleteCancel;
			case OrderStatus.RUSH:
				return TrainSpeed;
			default:
				return Unknown;
		}
	};

	const getColorByStatus = (status: string): TagProps['type'] => {
		switch (status) {
			case OrderStatus.PENDING:
				return 'outline';
			case OrderStatus.OVERDUE:
				return 'red';
			case OrderStatus.COMPLETED:
				return 'green';
			case OrderStatus.CANCELLED:
				return 'gray';
			case OrderStatus.RUSH:
				return 'purple';
			default:
				return 'cool-gray';
		}
	};

	$: screenSize = $screenSizeStore;

	$: if (screenSize == 'sm')
		dtColumns = orderColumns.filter((column) =>
			[
				orderDatatableColumnKeys.name,
				orderDatatableColumnKeys.status,
				orderDatatableColumnKeys.actions
			].includes(column.key)
		);
	else dtColumns = orderColumns;

	//#region Form

	let submissionError: Error | null = null;
	const openNewOrderModal = () => {
		isAddNewModalOpen = true;
		submitType = FormSubmitType.AddNew;
	};

	$: formTitle = submitType === FormSubmitType.AddNew ? 'Create new' : 'Edit';
	$: formSubmitIcon = submitType === FormSubmitType.AddNew ? Add : Edit;
	$: formActionUrl = submitType === FormSubmitType.AddNew ? '?/create' : '?/update';

	const { form, errors, enhance, capture, restore } = superForm(data.form, {
		dataType: 'json',
		autoFocusOnError: 'detect',
		defaultValidator: 'clear',
		validators: schema,
		taintedMessage: null,
		onResult: ({ result }) => {
			if (result.type !== 'failure') {
				isAddNewModalOpen = false;
				return;
			}

			submissionError = result?.data?.error;
		}
	});

	export const snapshot: Snapshot = {
		capture,
		restore
	};
	//#endregion
</script>

<Grid>
	<Row>
		<Column sm="{4}" md="{4}" lg="{4}">
			<HighlightTile text="New orders today" highlight="24" />
		</Column>
		<Column sm="{0}" md="{4}" lg="{4}">
			<HighlightTile
				clickHandler="{() => filterTable('pending digitizing')}"
				text="Pending digitizing:"
				highlight="14"
			/>
		</Column>
		<Column sm="{0}" md="{4}" lg="{4}">
			<HighlightTile
				clickHandler="{() => filterTable('pending vector')}"
				text="Pending vector:"
				highlight="10"
			/>
		</Column>
		<Column sm="{0}" md="{4}" lg="{4}">
			<HighlightTile
				clickHandler="{() => filterTable('overdue')}"
				text="Overdue:"
				highlight="10"
				type="warning"
			/>
		</Column>
	</Row>
	<Row class="default-gap">
		<Column>
			<DataTable sortable headers="{dtColumns}" rows="{tableData}">
				<strong slot="title">{title}</strong>
				<span slot="description" style="font-size: 1rem">
					{description}
				</span>
				<svelte:fragment slot="cell" let:row let:cell>
					{#if cell.key === orderDatatableColumnKeys.status}
						<Truncate>
							<Tag
								interactive
								icon="{getIconByStatus(row.status)}"
								type="{getColorByStatus(row.status)}"
								size="{screenSize == 'sm' ? screenSize : 'default'}"
							>
								{render(cell)}
							</Tag>
						</Truncate>
					{:else if cell.key === orderDatatableColumnKeys.actions}
						<OverflowMenu flipped width="1px">
							<OverflowMenuItem text="Restart" />
							<OverflowMenuItem
								href="https://cloud.ibm.com/docs/loadbalancer-service"
								text="API documentation"
							/>
							<OverflowMenuItem danger text="Stop" />
						</OverflowMenu>
					{:else if cell.key == orderDatatableColumnKeys.date}
						<TooltipDefinition tooltipText="{dayjs(cell.value).format('ddd, MMM D h:mm A')}">
							<Truncate>
								{render(cell)}
							</Truncate>
						</TooltipDefinition>
					{:else}
						<Truncate>
							{render(cell)}
						</Truncate>
					{/if}
				</svelte:fragment>

				<Toolbar>
					<ToolbarContent>
						<ToolbarSearch />
						<Button icon="{Renew}" kind="secondary" iconDescription="Refresh" />
						<Button icon="{Add}" accesskey="n" on:click="{openNewOrderModal}">Create New</Button>
					</ToolbarContent>
				</Toolbar>
			</DataTable>
		</Column>
	</Row>
</Grid>

<!-- #region Form -->
<ComposedModal
	bind:open="{isAddNewModalOpen}"
	aria-label="Add new order"
	aria-labelledby="add-new-order-modal-title"
	aria-describedby="add-new-order-modal-description"
	role="dialog"
	on:submit="{() => {
		isAddNewModalOpen = false;
	}}"
	on:close="{() => {
		isAddNewModalOpen = false;
	}}"
>
	<form method="POST" use:enhance action="{formActionUrl}">
		<ModalHeader label="{formTitle}">
			<Row>
				<Column sm="{12}" md="{4}" lg="{8}">
					<h3>Client</h3>
				</Column>
			</Row>
		</ModalHeader>
		<ModalBody hasForm class="{$screenSizeStore == 'sm' ? 'mobile-form' : ''}">
			<FormSubmissionError bind:error="{submissionError}" />
			<Row>
				<Column sm="{4}" md="{4}" lg="{8}">
					<TextInput
						id="name"
						name="name"
						labelText="Name*"
						invalid="{($errors?.order?.name?.length ?? 0) > 0}"
						invalidText="{($errors?.order?.name ?? [''])[0]}"
						bind:value="{$form.order.name}"
						minlength="{3}"
						placeholder="John Doe"
						tabindex="{1}"
					/>
				</Column>
				<Column sm="{4}" md="{4}" lg="{8}">
					<ComboBox
						placeholder="Select a client"
						items="{clients?.map((client) => ({ id: client.id, text: client.name }))}"
					/>
				</Column>
			</Row>
		</ModalBody>
	</form>
</ComposedModal>
