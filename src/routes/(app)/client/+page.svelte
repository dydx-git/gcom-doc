<script lang="ts">
	import HighlightTile from '$lib/components/HighlightTile.svelte';
	import { clientColumns, clientDatatableColumnKeys } from './columns';
	import { FormSubmitType } from '../meta';
	import { debounce } from 'debounce';
	import { Currency, EmailType, PayMethod, PhoneType } from '@prisma/client';
	import { superForm } from 'sveltekit-superforms/client';
	import { screenSizeStore, userPreferencesStore } from '$lib/store';
	import FormSubmissionError from '$lib/components/FormSubmissionError.svelte';
	import { CompanyLabel } from '$lib/modules/company/meta';
	import { schema } from '$lib/modules/client/meta';
	import {
		Grid,
		Column,
		Row,
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Button,
		OverflowMenu,
		OverflowMenuItem,
		Truncate,
		ComboBox,
		ComposedModal,
		FormGroup,
		FormLabel,
		InlineLoading,
		ModalBody,
		ModalFooter,
		ModalHeader,
		TextInput,
		Toggle,
		Select,
		SelectItem
	} from 'carbon-components-svelte';
	import { Renew, UserFollow, Add, Close, Edit, Subtract } from 'carbon-icons-svelte';
	import type { PageData, Snapshot } from './$types';
	import type { Address } from '$lib/address/meta';

	export let data: PageData;

	export let title = 'Clients';
	export let description = 'Showing all clients';
	$: tableData = data.client;

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

	//#region Form

	let submissionError: Error | null = null;

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

	const salesReps = data.salesRep;

	const addressSuggestionProps = {
		selectedItemId: null,
		items: [] as (Address & { id: number })[],
		placeholderText: 'No suggestions available.',
		response: null as Promise<Response> | null
	};

	const userPreferences = $userPreferencesStore;

	const formTitle = submitType === FormSubmitType.AddNew ? 'Create new' : 'Edit';
	const formSubmitIcon = submitType === FormSubmitType.AddNew ? Add : Edit;
	const formActionUrl = submitType === FormSubmitType.AddNew ? '?/create' : '?/update';

	const onOpen = (e: Event) => {};

	const onClose = (e: Event) => {};

	const onSubmit = (e: Event) => {
		const nameInput = document.getElementById('name') as HTMLInputElement;
	};

	const parseAddress = async () => {
		const address = $form.address.address;
		if (!address) return;

		addressSuggestionProps.selectedItemId = null;
		addressSuggestionProps.items = [];
		addressSuggestionProps.placeholderText = 'No suggestions available.';

		addressSuggestionProps.response = fetch(`/api/address?address=${address}`, {
			method: 'GET'
		});
		const response = await addressSuggestionProps.response;
		if (!response.ok) return;

		const addresses: Address[] = await response.json();
		addressSuggestionProps.items = addresses
			.filter((suggestion) => suggestion.city && suggestion.state)
			.map((suggestion, index) => {
				return {
					id: index,
					...suggestion
				};
			});
		addressSuggestionProps.placeholderText = 'Suggested addresses available. Click to select.';
	};

	const setAddress = () => {
		const address = addressSuggestionProps.items.find(
			(item) => item.id === addressSuggestionProps.selectedItemId
		);
		$form.address.address = address?.addressLine || $form.address.address;
		$form.address.city = address?.city || $form.address.city;
		$form.address.state = address?.state || $form.address.state;
		$form.address.zip = address?.zip || $form.address.zip;
		$form.address.country = address?.country || $form.address.country;
	};

	$: if (addressSuggestionProps.selectedItemId !== null) setAddress();
	//#endregion
</script>

<Grid>
	<Row>
		<Column sm="{4}" md="{{ span: 4, offset: 2 }}" lg="{{ span: 6, offset: 5 }}">
			<HighlightTile text="New clients this month" highlight="4" />
		</Column>
	</Row>
	<Row class="default-gap">
		<Column>
			<DataTable sortable headers="{clientColumns}" rows="{tableData}">
				<strong slot="title">{title}</strong>
				<span slot="description" style="font-size: 1rem">
					{description}
				</span>
				<svelte:fragment slot="cell" let:row let:cell>
					{#if cell.key == clientDatatableColumnKeys.actions}
						<OverflowMenu flipped width="1px">
							<OverflowMenuItem text="Restart" />
							<OverflowMenuItem
								href="https://cloud.ibm.com/docs/loadbalancer-service"
								text="API documentation"
							/>
							<OverflowMenuItem danger text="Stop" />
						</OverflowMenu>
					{:else}
						<Truncate>
							{(cell.display && cell.display(cell.value)) || cell.value}
						</Truncate>
					{/if}
				</svelte:fragment>

				<Toolbar>
					<ToolbarContent>
						<ToolbarSearch />
						<Button icon="{Renew}" kind="secondary" iconDescription="Refresh" />
						<Button icon="{UserFollow}" accesskey="n" on:click="{openNewOrderModal}"
							>Create New</Button
						>
					</ToolbarContent>
				</Toolbar>
			</DataTable>
		</Column>
	</Row>
</Grid>

<!-- #region Form -->

<ComposedModal
	bind:open="{isAddNewModalOpen}"
	selectorPrimaryFocus="#name"
	on:open="{onOpen}"
	on:close="{onClose}"
	on:submit="{onSubmit}"
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
						invalid="{($errors?.client?.name?.length ?? 0) > 0}"
						invalidText="{($errors?.client?.name ?? [''])[0]}"
						bind:value="{$form.client.name}"
						minlength="{3}"
						placeholder="John Doe"
						tabindex="{1}"
					/>
				</Column>
				<Column sm="{4}" md="{4}" lg="{8}">
					<TextInput
						labelText="Company"
						id="company"
						name="companyName"
						placeholder="Company Name"
						minlength="{3}"
						bind:value="{$form.client.companyName}"
						invalid="{($errors?.client?.companyName?.length ?? 0) > 0}"
						invalidText="{($errors?.client?.companyName ?? [''])[0]}"
						tabindex="{2}"
					/>
				</Column>
			</Row>
			<Row class="default-gap">
				<Column sm="{2}" md="{4}" lg="{8}">
					<ComboBox
						titleText="Company*"
						label="Company*"
						placeholder="Select a company"
						items="{Object.entries(CompanyLabel).map((key) => ({ id: key[0], text: key[1] }))}"
						invalid="{($errors?.client?.companyId?.length ?? 0) > 0}"
						invalidText="{($errors?.client?.companyId ?? [''])[0]}"
						itemToString="{(item) => item?.text ?? ''}"
						bind:selectedId="{$form.client.companyId}"
						tabindex="{3}"
					/>
				</Column>
				<Column sm="{2}" md="{4}" lg="{8}">
					<ComboBox
						placeholder="Select a sales rep"
						titleText="Sales Rep*"
						label="Sales Rep*"
						items="{salesReps?.map((rep) => ({ id: rep.username, text: rep.name }))}"
						itemToString="{(item) => item?.text ?? ''}"
						bind:selectedId="{$form.client.salesRepUsername}"
						invalid="{($errors?.client?.salesRepUsername?.length ?? 0) > 0}"
						invalidText="{($errors?.client?.salesRepUsername ?? [''])[0]}"
						tabindex="{4}"
					/>
				</Column>
			</Row>
			<FormGroup class="default-gap">
				{#each $form.phones as phone, i}
					<Row>
						<Column sm="{2}" md="{3}" lg="{4}">
							<TextInput
								type="tel"
								id="phone"
								labelText="Phone*"
								name="{`phones[${i}].phone`}"
								placeholder="(xxx) xxx-xxxx"
								invalid="{($errors?.phones?.[i]?.phone?.length ?? 0) > 0}"
								invalidText="{($errors?.phones?.[i]?.phone ?? [''])[0]}"
								bind:value="{phone.phone}"
								tabindex="{5 + i}"
							/>
						</Column>
						<Column sm="{2}" md="{2}" lg="{4}">
							<Select
								labelText="Type*"
								name="{`phones[${i}].type`}"
								bind:selected="{$form.phones[i].type}"
							>
								{#each Object.values(PhoneType) as type}
									<SelectItem value="{type}" text="{type}" />
								{/each}
							</Select>
						</Column>
						<Column sm="{0}" md="{2}" lg="{6}">
							<TextInput
								name="{`phones[${i}].description`}"
								placeholder="Personal phone etc."
								labelText="Description"
								bind:value="{phone.description}"
								tabindex="{7 + i}"
							/>
						</Column>
						<Column sm="{0}" md="{1}" lg="{1}">
							<Button
								kind="tertiary"
								icon="{Add}"
								size="small"
								iconDescription="Add phone number"
								tooltipPosition="left"
								on:click="{() => {
									$form.phones = [
										...$form.phones,
										{ phone: '', type: PhoneType.PRIMARY, description: '' }
									];
								}}"
							/>
							<Button
								kind="danger-tertiary"
								icon="{Subtract}"
								size="small"
								iconDescription="Remove phone number"
								disabled="{$form.phones.length === 1}"
								tooltipPosition="left"
								on:click="{() => {
									$form.phones = $form.phones.filter((_, index) => index !== i);
								}}"
							/>
						</Column>
					</Row>
				{/each}
			</FormGroup>
			<FormGroup>
				{#each $form.emails as email, i}
					<Row>
						<Column sm="{2}" md="{3}" lg="{4}">
							<TextInput
								labelText="Email*"
								type="email"
								id="email"
								name="{`emails[${i}].email`}"
								placeholder="john.doe@example.com"
								bind:value="{email.email}"
								invalid="{($errors?.emails?.[i]?.email?.length ?? 0) > 0}"
								invalidText="{($errors?.emails?.[i]?.email ?? [''])[0]}"
							/>
						</Column>
						<Column sm="{2}" md="{2}" lg="{4}">
							<Select
								labelText="Type*"
								name="{`phones[${i}].type`}"
								bind:selected="{$form.emails[i].type}"
							>
								{#each Object.values(EmailType) as type}
									<SelectItem value="{type}" text="{type}" />
								{/each}
							</Select>
						</Column>
						<Column sm="{0}" md="{2}" lg="{6}">
							<TextInput
								name="{`emails[${i}].description`}"
								placeholder="Description"
								labelText="Description"
								bind:value="{email.description}"
							/>
						</Column>
						<Column sm="{0}" md="{1}" lg="{1}">
							<Button
								kind="tertiary"
								icon="{Add}"
								size="small"
								iconDescription="Add email"
								tooltipPosition="left"
								on:click="{() => {
									$form.emails = [
										...$form.emails,
										{ email: '', type: EmailType.JOB, description: '' }
									];
								}}"
							/>
							<Button
								kind="danger-tertiary"
								icon="{Subtract}"
								size="small"
								iconDescription="Remove email"
								tooltipPosition="left"
								disabled="{$form.emails.length === 1}"
								on:click="{() => {
									$form.emails = $form.emails.filter((_, index) => index !== i);
								}}"
							/>
						</Column>
					</Row>
				{/each}
			</FormGroup>

			<Row>
				<Column sm="{2}" md="{4}" lg="{6}">
					<ComboBox
						placeholder="Select a payment method"
						titleText="Payment Method*"
						label="Payment Method*"
						items="{Object.entries(PayMethod).map((key) => ({ id: key[0], text: key[1] }))}"
						itemToString="{(item) => item?.text ?? ''}"
						bind:selectedId="{$form.client.payMethod}"
						invalid="{($errors?.client?.payMethod?.length ?? 0) > 0}"
						invalidText="{($errors?.client?.payMethod ?? [''])[0]}"
					/>
				</Column>
				<Column sm="{2}" md="{3}" lg="{4}">
					<Select
						labelText="Type*"
						bind:selected="{$form.client.currency}"
						invalid="{($errors?.client?.currency?.length ?? 0) > 0}"
						invalidText="{($errors?.client?.currency ?? [''])[0]}"
					>
						{#each Object.values(Currency) as curr}
							<SelectItem value="{curr}" text="{curr}" />
						{/each}
					</Select>
				</Column>
				<Column sm="{2}" md="{2}" lg="{4}">
					<Toggle
						labelText="Add transaction charges"
						bind:toggled="{$form.client.addTransactionCharges}"
					/>
				</Column>
			</Row>
			<FormGroup class="default-gap">
				<Row>
					<Column sm="{2}" md="{5}" lg="{5}">
						<TextInput
							labelText="Address*"
							name="address"
							placeholder="123 Main St."
							bind:value="{$form.address.address}"
							invalid="{($errors?.address?.address?.length ?? 0) > 0}"
							invalidText="{($errors?.address?.address ?? [''])[0]}"
							on:keyup="{debounce(parseAddress, userPreferences.inputToProcessDelay)}"
						/>
					</Column>
					<Column sm="{1}" md="{2}" lg="{4}">
						<TextInput
							labelText="City*"
							name="city"
							placeholder="Los Angeles"
							bind:value="{$form.address.city}"
							invalid="{($errors?.address?.city?.length ?? 0) > 0}"
							invalidText="{($errors?.address?.city ?? [''])[0]}"
						/>
					</Column>
					<Column sm="{1}" md="{2}" lg="{2}">
						<TextInput
							labelText="State*"
							name="state"
							placeholder="Code: CA, NY etc"
							bind:value="{$form.address.state}"
							invalid="{($errors?.address?.state?.length ?? 0) > 0}"
							invalidText="{($errors?.address?.state ?? [''])[0]}"
						/>
					</Column>
					<Column sm="{2}" md="{2}" lg="{2}">
						<TextInput
							labelText="Zip*"
							name="zip"
							placeholder="12345"
							bind:value="{$form.address.zip}"
							invalid="{($errors?.address?.zip?.length ?? 0) > 0}"
							invalidText="{($errors?.address?.zip ?? [''])[0]}"
						/>
					</Column>
					<Column sm="{2}" md="{3}" lg="{3}">
						<TextInput
							labelText="Country Code"
							name="country"
							placeholder="USA, UK etc"
							bind:value="{$form.address.country}"
							invalid="{($errors?.address?.country?.length ?? 0) > 0}"
							invalidText="{($errors?.address?.country ?? [''])[0]}"
						/>
					</Column>
				</Row>
				<Row class="default-gap">
					<Column sm="{3}" md="{5}" lg="{12}">
						<FormLabel>Address Suggestions</FormLabel>
						<ComboBox
							direction="top"
							bind:selectedId="{addressSuggestionProps.selectedItemId}"
							placeholder="{addressSuggestionProps.placeholderText}"
							items="{addressSuggestionProps.items.map((suggestion) => {
								return {
									id: suggestion.id,
									text: suggestion.formattedAddress,
									value: suggestion
								};
							})}"
						/>
					</Column>
					{#if addressSuggestionProps.response}
						<Column sm="{1}" md="{3}" lg="{4}" class="default-gap">
							{#await addressSuggestionProps.response}
								<InlineLoading
									description="Loading suggestions..."
									status="active"
									class="default-gap"
								/>
							{:then r}
								{#if r.ok}
									<InlineLoading
										description="Suggestions loaded!"
										status="finished"
										class="default-gap"
									/>
								{:else}
									<InlineLoading
										description="Error loading suggestions!"
										status="error"
										class="default-gap"
									/>
								{/if}
							{/await}
						</Column>
					{/if}
				</Row>
				<Row class="default-gap">
					<Column sm="{4}" md="{8}" lg="{15}">
						<TextInput
							labelText="Notes"
							bind:value="{$form.client.notes}"
							placeholder="Add notes"
							type="multi"
						/>
					</Column>
				</Row>
			</FormGroup>
		</ModalBody>
		<ModalFooter>
			<Button kind="secondary" on:click="{onClose}" icon="{Close}">Cancel</Button>
			<Button kind="primary" type="submit" icon="{formSubmitIcon}">{formTitle}</Button>
		</ModalFooter>
	</form>
</ComposedModal>

<!-- #endregion -->
