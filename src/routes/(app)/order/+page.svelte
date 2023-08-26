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
		Pagination,
		ContentSwitcher,
		Switch
	} from 'carbon-components-svelte';
	import FormSubmissionError from '$lib/components/FormSubmissionError.svelte';
	import type {
		DataTableCell,
		DataTableRow
	} from 'carbon-components-svelte/types/DataTable/DataTable.svelte';
	import type { TagProps } from 'carbon-components-svelte/types/Tag/Tag.svelte';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
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
		Close,
		Pen
	} from 'carbon-icons-svelte';
	import dayjs from 'dayjs';
	import { screenSizeStore } from '$lib/store';
	import { orderColumns, orderDatatableColumnKeys } from './columns';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import {
		OrderStatus,
		createOrderFormSchema,
		editOrderFormSchema,
		type CreateOrderFormSchema,
		type EditOrderFormSchema,
		type OrderDataTable,
		OrderPriceType
	} from '$lib/modules/order/meta';
	import type { Snapshot } from '@sveltejs/kit';
	import { CompanyLabel } from '$lib/modules/company/meta';
	import type { RfcEmailResponse } from '$lib/modules/gmail/dataTransformer';
	import { fuzzy } from 'fast-fuzzy';
	import hash from '@sindresorhus/string-hash';
	import type { ComboBoxItem } from 'carbon-components-svelte/types/ComboBox/ComboBox.svelte';
	import type { StatusCode } from '$lib/modules/common/interfaces/core';
	import type { IAttachment } from 'gmail-api-parse-message-ts';
	import clone from 'just-clone';
	import type { PendingOrderDetails } from '$lib/modules/stats/order';
	import { PriceType, Department, JobStatus, JobType } from '@prisma/client';
	import { JobStatusSchema, JobTypeSchema } from '$lib/prisma/zod';
	import { FormSubmitType, notificationStore } from '../meta';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { clients, vendors } = data;
	let title = 'Orders';
	let description = "Showing orders from 01 Jan'";

	$: tableData = data.orders;
	let filteredRowIds: number[] = [];
	let pageSize = 10,
		pageNum = 1;
	let searchQuery: string = '';

	$: pendingOrderDetails = data.pendingOrderDetails as PendingOrderDetails[];

	let isAddNewModalOpen = false,
		isRevisionModalOpen = false;
	let revisionOrderId: string | null;
	let submitType: FormSubmitType = FormSubmitType.AddNew;
	let dtColumns = orderColumns;
	const stitchCountPricingModeCutoff = 1000;

	const deleteOrder = async (orderId: number) => {
		const response = await fetch(`/api/order/${orderId}`, {
			method: 'DELETE'
		});
		if (response.ok) {
			const data: StatusCode = await response.json();
		}
	};

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

	//#region page lifecycle
	onMount(() => {
		data.isPageLoaded = true;
	});
	//#endregion

	//#region Create Form

	let orderNameInput: HTMLInputElement;
	let submissionError: string | null = null;
	const createFormEmptySchema = superValidateSync(createOrderFormSchema);
	let initialFormData: CreateOrderFormSchema = createFormEmptySchema.data;
	let initialFormError = createFormEmptySchema.errors;
	let pricing: PriceType | null = null;

	const openNewOrderModal = () => {
		isAddNewModalOpen = true;
		submitType = FormSubmitType.AddNew;
	};

	const openRevisionModal = () => {
		isRevisionModalOpen = true;
		openEditModal();
	};

	const onAddNewFormClear = (e: Event) => {
		$form = clone(initialFormData);
		$errors = clone(initialFormError);
	};

	const filterComboBoxItems = (item: ComboBoxItem, value: string) =>
		fuzzy(value.toString(), item.text) > 0.7;

	const setPriceType = () => {
		const { value } = orderNameInput;
		if (!value) return;

		//TODO: set job type
		pricing = PriceType.LEFTCHEST;
	};

	const setPrice = (clientId: string) => {
		if (!isNaN($form.order.price)) return;

		const client = clients?.find((client) => client.id == clientId);
		if (!client || !pricing || pricingMode == OrderPriceType.StitchCount) return;

		$form.order.price = +client.prices[pricing];
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
		const targetedForm = getCurrentForm();
		if (value) targetedForm.order.status = OrderStatus.RUSH;
		else targetedForm.order.status = OrderStatus.PENDING;
	};

	const getCurrentForm = () => {
		if (submitType === FormSubmitType.AddNew) return $form;
		return $editForm;
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

	const { form, errors, enhance, capture, restore, message } = superForm(
		data.form || createFormEmptySchema,
		{
			dataType: 'json',
			autoFocusOnError: 'detect',
			defaultValidator: 'clear',
			validators: createOrderFormSchema,
			taintedMessage: null,
			onSubmit: () => {
				$notificationStore = {
					type: 'info',
					title: 'Creating new order'
				};
			},
			onError: ({ result }) => {
				$notificationStore = {
					type: 'error',
					title: result.error.message
				};
			},
			onResult: ({ result }) => {
				if (result.type !== 'failure') {
					isAddNewModalOpen = false;
					$notificationStore = {
						type: 'success',
						title: 'Order created successfully'
					};
					return;
				}
			}
		}
	);

	const {
		form: editForm,
		errors: editErrors,
		enhance: editEnhance,
		message: editMessage,
		constraints: editConstraints
	} = superForm(superValidateSync(editOrderFormSchema), {
		dataType: 'json',
		autoFocusOnError: 'detect',
		defaultValidator: 'clear',
		validators: editOrderFormSchema,
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

	//#region Edit Form
	let isEditModalOpen = false;

	const getEditFormData = (row: OrderDataTable): EditOrderFormSchema => {
		const { id, name, price, date, vendorId, type } = row;
		const status = row.status == OrderStatus.OVERDUE ? OrderStatus.PENDING : row.status;

		return {
			order: {
				id,
				name,
				price: Number(price),
				status: JobStatusSchema.parse(status),
				createdAt: new Date(date),
				vendorId,
				type
			},
			po: {
				clientId: row.clientId
			}
		};
	};

	const openEditModal = (row: DataTableRow | null = null) => {
		isEditModalOpen = true;
		submitType = FormSubmitType.Edit;
		if (!row) return;
		$editForm = getEditFormData(row as OrderDataTable);
	};
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
						<OverflowMenu flipped>
							<OverflowMenuItem text="Edit" on:click="{(e) => openEditModal(row)}" />
							<OverflowMenuItem danger text="Delete" on:click="{(e) => deleteOrder(row.id)}" />
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
							bind:filteredRowIds />
						<Button
							icon="{Pen}"
							accesskey="r"
							on:click="{openRevisionModal}"
							kind="secondary"
							iconDescription="Add revision" />
						<Button icon="{Add}" accesskey="n" on:click="{openNewOrderModal}">Create New</Button>
					</ToolbarContent>
				</Toolbar>
			</DataTable>
			<Pagination bind:pageSize bind:page="{pageNum}" totalItems="{filteredRowIds.length}" />
		</Column>
	</Row>
</Grid>

<!-- #region Order Create Form -->
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
		<ModalBody hasForm class="{$screenSizeStore == 'sm' ? 'mobile-form' : ''} full-screen-form">
			<FormSubmissionError bind:error="{submissionError}" />
			<Row>
				<Column sm="{2}" md="{3}" lg="{5}">
					<ComboBox
						id="company"
						titleText="Company"
						placeholder="Select a company"
						shouldFilterItem="{filterComboBoxItems}"
						on:select="{onRfcIdChange}"
						bind:selectedId="{selectedCompanyId}"
						items="{Object.entries(CompanyLabel).map((key) => ({ id: key[0], text: key[1] }))}" />
				</Column>
				<Column sm="{8}" md="{5}" lg="{10}">
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
						on:blur="{setPriceType}"
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
						placeholder="Select a client"
						shouldFilterItem="{filterComboBoxItems}"
						bind:selectedId="{$form.po.clientId}"
						on:select="{() => setPrice($form.po.clientId)}"
						items="{clients?.map((client) => ({ id: client.id, text: client.name }))}"
						invalid="{($errors?.po?.clientId?.length ?? 0) > 0}"
						invalidText="{($errors?.po?.clientId ?? [''])[0]}"
						itemToString="{(item) => item?.text ?? ''}" />
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
						placeholder="Select a vendor"
						shouldFilterItem="{filterComboBoxItems}"
						items="{vendors?.map((vendor) => ({ id: vendor.id, text: vendor.name }))}"
						invalid="{($errors?.order?.vendorId?.length ?? 0) > 0}"
						invalidText="{($errors?.order?.vendorId ?? [''])[0]}"
						itemToString="{(item) => item?.text ?? ''}"
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
			<Button kind="secondary" on:click="{onAddNewFormClear}" icon="{Close}">Clear</Button>
			<Button kind="primary" type="submit" icon="{formSubmitIcon}">{formTitle}</Button>
		</ModalFooter>
	</form>
</ComposedModal>
<!-- #endregion -->

<!-- #region Order Edit Form -->
<ComposedModal
	bind:open="{isEditModalOpen}"
	aria-label="Edit order"
	aria-labelledby="edit-order-modal-title"
	aria-describedby="edit-order-modal-description"
	on:close="{() => {
		isEditModalOpen = false;
	}}"
	role="dialog">
	<form method="POST" use:editEnhance action="{formActionUrl}">
		<ModalHeader label="Edit order">
			<Row>
				<Column sm="{12}" md="{4}" lg="{8}">
					<h3>Order</h3>
				</Column>
			</Row>
		</ModalHeader>
		<ModalBody hasForm class="{$screenSizeStore == 'sm' ? 'mobile-form' : ''}">
			<FormSubmissionError bind:error="{submissionError}" />
			<Row>
				<Column sm="{4}" md="{10}" lg="{16}">
					{#if isRevisionModalOpen}
						<ComboBox
							id="orders"
							titleText="Order"
							placeholder="Select an order"
							shouldFilterItem="{filterComboBoxItems}"
							bind:selectedId="{revisionOrderId}"
							on:select="{() => {
								if (!tableData) return;

								const row = tableData.find((order) => order.id == revisionOrderId);
								if (!row) return;
								const revisionData = clone(row);
								revisionData.type = JobType.REVISION;
								revisionData.name = `${row.name} (Rev.)`;
								revisionData.price = '0';
								revisionData.date = new Date().toISOString();
								revisionData.status = JobStatus.PENDING;
								$editForm = getEditFormData(revisionData);
								$editErrors = clone(superValidateSync(editOrderFormSchema).errors);
							}}"
							items="{tableData?.map((row) => ({
								id: row.id,
								text: `${row.name} - ${row.client}`
							}))}"
							itemToString="{(item) => item?.text ?? ''}" />
						<Row class="default-gap" />
					{/if}
				</Column>
				<Column sm="{4}" md="{4}" lg="{10}">
					<TextInput
						id="name"
						name="name"
						bind:ref="{orderNameInput}"
						on:blur="{setPriceType}"
						labelText="Order Name*"
						invalid="{($editErrors?.order?.name?.length ?? 0) > 0}"
						invalidText="{($editErrors?.order?.name ?? [''])[0]}"
						bind:value="{$editForm.order.name}"
						placeholder="ABC Logo"
						tabindex="{1}" />
				</Column>
				<Column sm="{4}" md="{2}" lg="{5}">
					<NumberInput
						hideSteppers
						id="price"
						name="price"
						label="Price*"
						warn="{pricingMode == OrderPriceType.StitchCount}"
						warnText="Using stitch count pricing mode"
						invalid="{($editErrors?.order?.price?.length ?? 0) > 0}"
						invalidText="{($editErrors?.order?.price ?? [''])[0]}"
						bind:value="{$editForm.order.price}" />
				</Column>
			</Row>
			<Row class="default-gap">
				<Column sm="{3}" md="{4}" lg="{7}">
					<ComboBox
						id="client"
						titleText="Client*"
						placeholder="Select a client"
						shouldFilterItem="{filterComboBoxItems}"
						bind:selectedId="{$editForm.po.clientId}"
						disabled="{isRevisionModalOpen}"
						on:select="{() => setPrice($editForm.po.clientId)}"
						items="{clients?.map((client) => ({ id: client.id, text: client.name }))}"
						invalid="{($editErrors?.po?.clientId?.length ?? 0) > 0}"
						invalidText="{($editErrors?.po?.clientId ?? [''])[0]}"
						itemToString="{(item) => item?.text ?? ''}" />
				</Column>
				<Column sm="{3}" md="{4}" lg="{8}">
					<ComboBox
						id="vendor"
						titleText="Vendor*"
						placeholder="Select a vendor"
						shouldFilterItem="{filterComboBoxItems}"
						items="{vendors?.map((vendor) => ({ id: vendor.id, text: vendor.name }))}"
						invalid="{($editErrors?.order?.vendorId?.length ?? 0) > 0}"
						invalidText="{($editErrors?.order?.vendorId ?? [''])[0]}"
						itemToString="{(item) => item?.text ?? ''}"
						bind:selectedId="{$editForm.order.vendorId}"
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
			</Row>
			<Row class="default-gap">
				<Column sm="{4}" md="{4}" lg="{5}">
					<ComboBox
						id="status"
						titleText="Status"
						direction="top"
						items="{Object.values(JobStatus).map((status) => ({ id: status, text: status }))}"
						itemToString="{(item) => item?.text ?? ''}"
						invalid="{($editErrors?.order?.status?.length ?? 0) > 0}"
						invalidText="{($editErrors?.order?.status ?? [''])[0]}"
						bind:selectedId="{$editForm.order.status}" />
				</Column>
				<Column sm="{4}" md="{4}" lg="{4}">
					<ComboBox
						id="type"
						titleText="Type"
						direction="top"
						disabled="{isRevisionModalOpen}"
						items="{Object.values(JobType).map((type) => ({ id: type, text: type }))}"
						itemToString="{(item) => item?.text ?? ''}"
						invalid="{($editErrors?.order?.type?.length ?? 0) > 0}"
						invalidText="{($editErrors?.order?.type ?? [''])[0]}"
						bind:selectedId="{$editForm.order.type}" />
				</Column>
				<Column sm="{2}" md="{4}" lg="{6}">
					<!-- TODO: Fix type error at 'value' -->
					<TextInput
						labelText="Created At"
						placeholder="Date & time created"
						invalid="{($editErrors?.order?.createdAt?.length ?? 0) > 0}"
						invalidText="{($editErrors?.order?.createdAt ?? [''])[0]}"
						bind:value="{$editForm.order.createdAt}" />
				</Column>
			</Row>
		</ModalBody>
		<ModalFooter>
			<Button kind="secondary" on:click="{onAddNewFormClear}" icon="{Close}">Clear</Button>
			<Button kind="primary" type="submit" icon="{formSubmitIcon}">{formTitle}</Button>
		</ModalFooter>
	</form>
</ComposedModal>

<!-- #endregion -->
