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
		FormLabel,
		FileUploaderDropContainer,
		FileUploaderButton,
		FileUploaderItem,
		ModalFooter,
		Pagination
	} from 'carbon-components-svelte';
	import FormSubmissionError from '$lib/components/FormSubmissionError.svelte';
	import type {
		DataTableCell,
		DataTableRow
	} from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import type { TagProps } from 'carbon-components-svelte/types/Tag/Tag.svelte';
	import { page } from '$app/stores';
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
		Edit,
		Close
	} from 'carbon-icons-svelte';
	import dayjs from 'dayjs';
	import { screenSizeStore } from '$lib/store';
	import { orderColumns, orderDatatableColumnKeys } from './columns';
	import { superForm } from 'sveltekit-superforms/client';
	import { OrderStatus, schema, type OrderSchema } from '$lib/modules/order/meta';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { FormSubmitType } from '../meta.js';
	import type { Snapshot } from '@sveltejs/kit';
	import { CompanyLabel } from '$lib/modules/company/meta';
	import type { RfcEmailResponse } from '$lib/modules/gmail/dataTransformer';
	import { OrderPriceType } from './meta';
	import { fuzzy } from 'fast-fuzzy';
	import hash from '@sindresorhus/string-hash';
	import type { ComboBoxItem } from 'carbon-components-svelte/types/ComboBox/ComboBox.svelte';
	import type { StatusCode } from '$lib/modules/common/interfaces/core';
	import type { IAttachment } from 'gmail-api-parse-message-ts';
	import clone from 'just-clone';
	import type { PendingOrderDetails } from '$lib/modules/stats/order';
	import { Department, JobStatus, PriceType } from '@prisma/client';

	export let data;
	const { clients, vendors } = data;
	export let title = 'Orders';
	export let description = "Showing orders from 01 Jan'";

	$: tableData = data.orders;
	let filteredRowIds: number[] = [];
	let pageSize = 10,
		pageNum = 1;
	let searchQuery: string = '';

	$: pendingOrderDetails = data.pendingOrderDetails as PendingOrderDetails[];

	let isAddNewModalOpen = false;
	let submitType: FormSubmitType = FormSubmitType.AddNew;
	let dtColumns = orderColumns;
	const stitchCountPricingModeCutoff = 1000;

	const getRowId = (row: DataTableRow) => row.id;

	const filterTable = (row: DataTableRow, query: string | number): boolean => {
		const searchable = `${row.name} ${row.price} ${row.status} ${row.client} ${
			row.vendor
		} ${new Date(row.date).toISOString().slice(0, 10)}`;
		return fuzzy(query.toString(), searchable) > 0.7;
	};

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

	const getNextStatus = (status: OrderStatus): OrderStatus => {
		const pendingStatuses = [OrderStatus.PENDING, OrderStatus.OVERDUE, OrderStatus.RUSH];
		const completedStatuses = [OrderStatus.COMPLETED, OrderStatus.CANCELLED];

		if (pendingStatuses.includes(status)) return OrderStatus.COMPLETED;

		return OrderStatus.PENDING;
	};

	const modifyStatus = (orderId: number, status: OrderStatus) => async (e: MouseEvent) => {
		const { innerText } = e.target as HTMLElement;

		if (!innerText) return;

		const response = await fetch(`?/update`, {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				'x-sveltekit-action': 'true'
			},
			body: JSON.stringify({ status: getNextStatus(status), id: orderId })
		});
		if (response.ok) {
			const data: JobStatus = await response.json();
			console.log(data);
		}

		const unknownError = data as unknown;
		const err = unknownError as Error;
		submissionError = err.message;
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

	let orderNameInput: HTMLInputElement;
	let submissionError: string | null = null;
	let initialFormData: OrderSchema | null = null;
	let initialFormError: any | null = null;
	let jobType: PriceType = PriceType.LEFTCHEST;

	const openNewOrderModal = () => {
		isAddNewModalOpen = true;
		submitType = FormSubmitType.AddNew;
	};

	const onClear = (e: Event) => {
		if (initialFormData != null) $form = clone(initialFormData);
		if (initialFormError != null) $errors = clone(initialFormError);
	};

	$: if ($form && !initialFormData) {
		initialFormData = clone($form);
	}

	$: if ($errors && !initialFormError) {
		initialFormError = clone($errors);
	}

	const filterComboBoxItems = (item: ComboBoxItem, value: string) =>
		fuzzy(value.toString(), item.text) > 0.7;

	const setJobType = () => {
		const { value } = orderNameInput;
		if (!value) return;

		//TODO: set job type
		jobType = PriceType.LEFTCHEST;
	};

	const setPrice = (clientId: string) => {
		if (!isNaN($form.order.price)) return;

		const client = clients?.find((client) => client.id == clientId);
		if (!client || !jobType || pricingMode == OrderPriceType.StitchCount) return;

		$form.order.price = +client.prices[jobType];
	};

	//#region file upload
	const acceptedFileTypes = [
		'.pdf',
		'.doc',
		'.docx',
		'.jpg',
		'.jpeg',
		'.png',
		'.bmp',
		'.cdr',
		'.ai',
		'.svg',
		'.eps'
	];
	// define max file size as 20 mb
	const maxFileSize = 20_971_520;
	const validateUploadFiles = (files: readonly File[]) =>
		files.filter((file) => file.size < maxFileSize && acceptedFileTypes.includes(file.type));

	//#endregion file upload

	const handleRushToggle = (event: MouseEvent) => {
		const { value } = event.target as HTMLInputElement;
		if (value) $form.order.status = OrderStatus.RUSH;
		else $form.order.status = OrderStatus.PENDING;
	};

	//#region Rfc
	let rfcId = '',
		messageId: string | null = null;
	let selectedCompanyId: number | null = null;
	let isLoadingRfc = false;
	let attachmentFilesFromServer: Omit<IAttachment, 'attachmentId'>[] = [];

	const onRfcIdChange = async () => {
		if (!rfcId || !selectedCompanyId) return;

		isLoadingRfc = true;
		const response = await fetch(
			`/api/email/${selectedCompanyId}/rfc?id=${encodeURIComponent(rfcId)}`
		);
		const data: RfcEmailResponse = await response.json();
		isLoadingRfc = false;
		if (!response.ok) {
			const unknownError = data as unknown;
			const err = unknownError as Error;
			submissionError = err.message;
			return;
		}

		attachmentFilesFromServer = data.attachments;
		messageId = data.messageId;
		setFormData(data);
		orderNameInput.focus();
	};

	//#endregion

	$: formTitle = submitType === FormSubmitType.AddNew ? 'Create new' : 'Edit';
	$: formSubmitIcon = submitType === FormSubmitType.AddNew ? Add : Edit;
	$: formActionUrl = submitType === FormSubmitType.AddNew ? '?/create' : '?/update';

	const { form, errors, enhance, capture, restore, message } = superForm(data.form, {
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
		}
	});

	$: if ($message) submissionError = $message;

	const setFormData = (email: RfcEmailResponse) => {
		if (email.clientId) $form.po.clientId = email.clientId;
		$form.gmail.attachments = email.attachments;
		$form.gmail.threadId = email.threadId;
		$form.gmail.inboxMsgId = email.messageId;
		$form.gmail.rfcId = rfcId;
		$form.gmail.companyId = email.companyId;
		$form.gmail.body = email.body;
	};

	export const snapshot: Snapshot = {
		capture,
		restore
	};

	$: pricingMode =
		$form?.order?.price > stitchCountPricingModeCutoff
			? OrderPriceType.StitchCount
			: OrderPriceType.FlatRate;
	//#endregion
</script>

<Grid>
	<Row>
		<Column sm="{4}" md="{4}" lg="{4}">
			<HighlightTile text="New orders today" highlight="{data.orderCount?.toString()}" />
		</Column>
		<Column sm="{0}" md="{4}" lg="{4}">
			<HighlightTile
				clickHandler="{() => (searchQuery = 'pending logo')}"
				text="Pending digitizing:"
				type="warning"
				highlight="{pendingOrderDetails
					?.filter((order) => order.type == Department.DIGITIZING)
					.length.toString()}" />
		</Column>
		<Column sm="{0}" md="{4}" lg="{4}">
			<HighlightTile
				clickHandler="{() => (searchQuery = 'pending vector')}"
				text="Pending vector:"
				type="warning"
				highlight="{pendingOrderDetails
					?.filter((order) => order.type == Department.VECTOR)
					.length.toString()}" />
		</Column>
		<Column sm="{0}" md="{4}" lg="{4}">
			<HighlightTile
				clickHandler="{() => (searchQuery = 'pending overdue')}"
				text="Overdue:"
				type="danger"
				highlight="{pendingOrderDetails?.filter((order) => order.isOverdue).length.toString()}" />
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
								on:click="{modifyStatus(row.id, row.status)}"
								interactive
								icon="{getIconByStatus(row.status)}"
								type="{getColorByStatus(row.status)}"
								size="{screenSize == 'sm' ? screenSize : 'default'}">
								{render(cell)}
							</Tag>
						</Truncate>
					{:else if cell.key === orderDatatableColumnKeys.actions}
						<OverflowMenu flipped width="1px">
							<OverflowMenuItem text="Restart" />
							<OverflowMenuItem
								href="https://cloud.ibm.com/docs/loadbalancer-service"
								text="API documentation" />
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
						<ToolbarSearch
							bind:value="{searchQuery}"
							shouldFilterRows="{filterTable}"
							bind:filteredRowIds="{filteredRowIds}" />
						<Button icon="{Renew}" kind="secondary" iconDescription="Refresh" />
						<Button icon="{Add}" accesskey="n" on:click="{openNewOrderModal}">Create New</Button>
					</ToolbarContent>
				</Toolbar>
			</DataTable>
			<Pagination
				bind:pageSize="{pageSize}"
				bind:page="{pageNum}"
				totalItems="{filteredRowIds.length}" />
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
	on:close="{() => {
		isAddNewModalOpen = false;
	}}">
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
						shouldFilterItem="{filterComboBoxItems}"
						on:select="{onRfcIdChange}"
						bind:selectedId="{selectedCompanyId}"
						items="{Object.entries(CompanyLabel).map((key) => ({ id: key[0], text: key[1] }))}" />
				</Column>
				<Column sm="{8}" md="{8}" lg="{10}">
					<TextInput
						id="rfc"
						labelText="RFC Id"
						placeholder="RFC Message-Id from a Gmail message"
						bind:value="{rfcId}"
						on:input="{onRfcIdChange}" />
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
						bind:ref="{orderNameInput}"
						on:blur="{setJobType}"
						labelText="Order Name*"
						invalid="{($errors?.order?.name?.length ?? 0) > 0}"
						invalidText="{($errors?.order?.name ?? [''])[0]}"
						bind:value="{$form.order.name}"
						minlength="{3}"
						placeholder="ABC Logo"
						tabindex="{1}" />
				</Column>
				<Column sm="{4}" md="{4}" lg="{7}">
					<ComboBox
						id="client"
						titleText="Client*"
						label="Client*"
						placeholder="Select a client"
						shouldFilterItem="{filterComboBoxItems}"
						bind:selectedId="{$form.po.clientId}"
						on:select="{() => setPrice($form.po.clientId)}"
						items="{clients?.map((client) => ({ id: client.id, text: client.name }))}" />
				</Column>
			</Row>
			<Row class="default-gap">
				<Column sm="{2}" md="{2}" lg="{4}">
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
						placeholder="" />
				</Column>
				<Column sm="{3}" md="{4}" lg="{8}">
					<ComboBox
						id="vendor"
						titleText="Vendor*"
						label="Vendor*"
						placeholder="Select a vendor"
						shouldFilterItem="{filterComboBoxItems}"
						items="{vendors?.map((vendor) => ({ id: vendor.id, text: vendor.name }))}"
						bind:selectedId="{$form.order.vendorId}"
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
			<Row class="default-gap">
				<Column sm="{2}" md="{4}" lg="{9}">
					<TextInput
						labelText="Append to subject"
						placeholder="Subject"
						bind:value="{$form.gmail.subjectAddendum}" />
					<div
						placeholder="Email body"
						bind:innerHTML="{$form.gmail.body}"
						contenteditable
						class="bx--text-area"
						style="min-height: 220px">
					</div>
				</Column>
				<Column>
					<FormLabel>Attachments</FormLabel>
					<FileUploaderDropContainer
						labelText="Upload files"
						accept="{acceptedFileTypes}"
						multiple
						validateFiles="{validateUploadFiles}" />
					{#each attachmentFilesFromServer as attachment}
						<a
							href="api/files/attachment/{messageId}?id={hash(
								attachment.mimeType + attachment.size.toString()
							)}"
							target="_blank">
							<FileUploaderItem name="{attachment.filename}" status="complete" />
						</a>
					{/each}
					<FileUploaderButton labelText="Add files" accept="{acceptedFileTypes}" multiple />
				</Column>
			</Row>
		</ModalBody>
		<ModalFooter>
			<Button kind="secondary" on:click="{onClear}" icon="{Close}">Clear</Button>
			<Button kind="primary" type="submit" icon="{formSubmitIcon}" accesskey="s"
				>{formTitle}</Button>
		</ModalFooter>
	</form>
</ComposedModal>
<!-- #endregion -->
