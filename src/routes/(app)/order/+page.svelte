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
		ComboBox,
		InlineLoading,
		NumberInput,
		Toggle,
		FormLabel
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
	import { CompanyLabel } from '$lib/modules/company/meta';
	import type { RfcEmailResponse } from '$lib/modules/gmail/dataTransformer';
	import { OrderPriceType } from './meta';

	export let data;
	const { clients, orders, vendors } = data;
	export let title = 'Orders';
	export let description = "Showing orders from 01 Jan'";

	export let tableData = orders;

	let isAddNewModalOpen = false;
	let submitType: FormSubmitType = FormSubmitType.AddNew;
	let dtColumns = orderColumns;
	const stitchCountPricingModeCutoff = 1000;

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

	const handleRushToggle = (event: MouseEvent) => {
		const { value } = event.target as HTMLInputElement;
		if (value) $form.order.status = OrderStatus.RUSH;
		else $form.order.status = OrderStatus.PENDING;
	};

	//#region Rfc
	let rfcId = '';
	let selectedCompanyId: number | null = null;
	let isLoadingRfc = false;

	const onRfcIdChange = async () => {
		if (!rfcId || !selectedCompanyId) return;

		isLoadingRfc = true;
		const response = await fetch(
			`/api/email/${selectedCompanyId}/rfc?id=${encodeURIComponent(rfcId)}`
		);
		const data: RfcEmailResponse = await response.json();
		isLoadingRfc = false;
		if (!response.ok) {
			const error = data as unknown;
			submissionError = error as Error;
			return;
		}
	};

	//#endregion

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

	$: pricingMode =
		$form.order.price > stitchCountPricingModeCutoff
			? OrderPriceType.StitchCount
			: OrderPriceType.FlatRate;
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
					<h3>Order</h3>
				</Column>
			</Row>
		</ModalHeader>
		<ModalBody hasForm class="{$screenSizeStore == 'sm' ? 'mobile-form' : ''}">
			<FormSubmissionError bind:error="{submissionError}" />
			<Row>
				<Column sm="{2}" md="{2}" lg="{5}">
					<ComboBox
						id="company"
						titleText="Company"
						label="Company"
						placeholder="Select a company"
						on:select="{onRfcIdChange}"
						bind:selectedId="{selectedCompanyId}"
						items="{Object.entries(CompanyLabel).map((key) => ({ id: key[0], text: key[1] }))}"
					/>
				</Column>
				<Column sm="{8}" md="{8}" lg="{10}">
					<TextInput
						id="rfc"
						labelText="RFC Id"
						placeholder="RFC Message-Id from a Gmail message"
						bind:value="{rfcId}"
						on:input="{onRfcIdChange}"
					/>
				</Column>
				<Column sm="{1}" md="{1}" lg="{1}" class="default-gap">
					{#if isLoadingRfc}
						<div class="default-gap">
							<InlineLoading />
						</div>
					{/if}
				</Column>
			</Row>
			<Row class="default-gap">
				<Column sm="{4}" md="{4}" lg="{8}">
					<TextInput
						id="name"
						name="name"
						labelText="Order Name*"
						invalid="{($errors?.order?.name?.length ?? 0) > 0}"
						invalidText="{($errors?.order?.name ?? [''])[0]}"
						bind:value="{$form.order.name}"
						minlength="{3}"
						placeholder="ABC Logo"
						tabindex="{1}"
					/>
				</Column>
				<Column sm="{4}" md="{4}" lg="{8}">
					<ComboBox
						id="client"
						titleText="Client*"
						label="Client*"
						placeholder="Select a client"
						items="{clients?.map((client) => ({ id: client.id, text: client.name }))}"
					/>
				</Column>
			</Row>
			<Row>
				<Column sm="{1}" md="{2}" lg="{4}">
					<NumberInput
						hideSteppers
						id="price"
						name="price"
						label="Price*"
						warn="{pricingMode == OrderPriceType.StitchCount}"
						warnText="Using stitch count pricing mode"
						invalid="{($errors?.order?.price?.length ?? 0) > 0}"
						invalidText="{($errors?.order?.price ?? [''])[0]}"
						bind:value="{$form.order.price}"
						minlength="{3}"
						placeholder=""
					/>
				</Column>
				<Column sm="{3}" md="{4}" lg="{8}">
					<ComboBox
						id="vendor"
						titleText="Vendor*"
						label="Vendor*"
						placeholder="Select a vendor"
						items="{vendors?.map((vendor) => ({ id: vendor.id, text: vendor.name }))}"
						let:item
						let:index>
						<div style="margin-top: -10px">
							{item.text}
							<Tag type="outline" icon="{InProgress}" class="cds--type-body-01">
								{vendors ? vendors[index].orders.pending : 0}
							</Tag>
							<Tag type="red" icon="{InProgressWarning}" class="cds--type-body-01">
								{vendors ? vendors[index].orders.overdue : 0}
							</Tag>
							<Tag type="purple" icon="{TrainSpeed}" class="cds--type-body-01">
								{vendors ? vendors[index].orders.rush : 0}
							</Tag>
						</div>
					</ComboBox>
				</Column>
				<Column sm="{1}" md="{2}" lg="{4}">
					<FormLabel style="margin-top: 5px">Rush</FormLabel>
					<Toggle id="rush" name="rush" labelText="Rush" on:click="{handleRushToggle}" hideLabel />
				</Column>
			</Row>
		</ModalBody>
	</form>
</ComposedModal>
