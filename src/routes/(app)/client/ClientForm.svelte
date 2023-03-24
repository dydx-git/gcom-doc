<script lang="ts">
	import { debounce } from 'debounce';
	import { Currency, EmailType, PayMethod, PhoneType } from '@prisma/client';
	import get from 'lodash.get';
	import set from 'lodash.set';
	import { superForm } from 'sveltekit-superforms/client';
	import {
		Button,
		Column,
		ComboBox,
		ComposedModal,
		Dropdown,
		FormGroup,
		FormLabel,
		InlineLoading,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Row,
		Select,
		SelectItem,
		TextInput,
		Toggle
	} from 'carbon-components-svelte';
	import { Add, Close, Edit, Subtract } from 'carbon-icons-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { screenSizeStore, userPreferencesStore } from '$lib/store';
	import { CompanyLabel, type Address } from '../../../lib/modules/client/meta';
	import type { ValidatedInput } from '../../../lib/modules/common/interfaces/form';
	import { FormSubmitType, schema } from './meta';
	import type { PageData } from './$types';

	export let open = false;
	export let submitType: FormSubmitType;

	export let data: PageData;
	let submissionError: Error | null = null;

	const { form, errors, enhance, delayed } = superForm(data.form, {
		dataType: 'json',
		autoFocusOnError: 'detect',
		defaultValidator: 'clear',
		validators: schema,
		onResult: ({ result }) => {
			if (result.type !== 'failure') return;
			console.log(result);

			submissionError = result?.data?.error;
		}
	});

	const addressSuggestionProps = {
		selectedItemId: null,
		items: [] as (Address & { id: number })[],
		placeholderText: 'No suggestions available.',
		response: null as Promise<Response> | null
	};

	const userPreferences = $userPreferencesStore;

	let formTitle = submitType === FormSubmitType.AddNew ? 'Create new' : 'Edit';
	let formSubmitIcon = submitType === FormSubmitType.AddNew ? Add : Edit;

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
		client.address = address?.addressLine || client.address;
		client.city = address?.city || client.city;
		client.state = address?.state || client.state;
		client.zip = address?.zip || client.zip;
		client.country = address?.country || client.country;
	};

	onMount(() => {});
	onDestroy(() => {});

	$: if (addressSuggestionProps.selectedItemId !== null) setAddress();
</script>

<ComposedModal
	bind:open="{open}"
	selectorPrimaryFocus="#name"
	on:open="{onOpen}"
	on:close="{onClose}"
	on:submit="{onSubmit}"
>
	<form method="POST" use:enhance>
		<ModalHeader label="{formTitle}">
			<Row>
				<Column sm="{12}" md="{4}" lg="{8}">
					<h3>Client</h3>
				</Column>
			</Row>
		</ModalHeader>
		<ModalBody hasForm class="{$screenSizeStore == 'sm' ? 'mobile-form' : ''}">
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
					/>
				</Column>
				<Column sm="{4}" md="{4}" lg="{7}">
					<TextInput
						labelText="Company"
						id="company"
						name="companyName"
						placeholder="Company Name"
						minlength="{3}"
						bind:value="{$form.client.companyName}"
						invalid="{($errors?.client?.companyName?.length ?? 0) > 0}"
						invalidText="{($errors?.client?.companyName ?? [''])[0]}"
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
								pattern="(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}"
								labelText="Phone*"
								name="{`phones[${i}].phone`}"
								placeholder="(xxx) xxx-xxxx"
								invalid="{($errors?.phones?.[i]?.phone?.length ?? 0) > 0}"
								invalidText="{($errors?.phones?.[i]?.phone ?? [''])[0]}"
								bind:value="{phone.phone}"
							/>
						</Column>
						<Column sm="{2}" md="{2}" lg="{4}">
							<Select labelText="Type*" name="{`phones[${i}].type`}" bind:selected="{phone.type}">
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
								required
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
							<Select labelText="Type*" name="{`emails[${i}].type`}" bind:selected="{email.type}">
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
										{ email: '', type: EmailType.PRIMARY, description: '' }
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
				<Column sm="{2}" md="{2}" lg="{4}">
					<Select required labelText="Company*" bind:selected="{$form.client.companyId}">
						{#each Object.entries(CompanyLabel) as [key, value]}
							<SelectItem value="{key}" text="{value}" />
						{/each}
					</Select>
				</Column>
				<Column sm="{2}" md="{2}" lg="{4}">
					<!-- <Dropdown
						labelText="Sales Person*"
						items={salesReps}
						itemToString={(item) => item?.name ?? ''}
						bind:selected={client.salesRep}
						required
					/> -->
				</Column>
			</Row>
			<Row class="default-gap">
				<Column sm="{2}" md="{2}" lg="{4}">
					<Select labelText="Invoice Currency*" bind:selected="{client.currency}" required>
						{#each Object.keys(Currency) as currency}
							<SelectItem value="{currency}" text="{currency}" />
						{/each}
					</Select>
				</Column>
				<Column sm="{2}" md="{2}" lg="{4}">
					<Select labelText="Payment Method*" bind:selected="{client.paymentMethod}" required>
						{#each Object.values(PayMethod) as pay}
							<SelectItem value="{pay}" text="{pay}" />
						{/each}
					</Select>
				</Column>
				<Column sm="{2}" md="{2}" lg="{4}">
					<Toggle
						labelText="Add transaction charges"
						bind:toggled="{client.addTransactionCharge}"
					/>
				</Column>
			</Row>
			<Row class="default-gap">
				<Column sm="{4}" md="{8}" lg="{15}">
					<TextInput
						labelText="Notes"
						bind:value="{client.notes}"
						placeholder="Add notes"
						type="multi"
					/>
				</Column>
			</Row>
			<FormGroup class="default-gap">
				<Row>
					<Column sm="{2}" md="{4}" lg="{4}">
						<TextInput
							labelText="Address*"
							required
							name="address"
							placeholder="123 Main St."
							bind:value="{client.address}"
							invalid="{formElements.address.invalid}"
							invalidText="{formElements.address.invalidText}"
							on:keyup="{debounce(parseAddress, userPreferences.inputToProcessDelay)}"
						/>
					</Column>
					<Column sm="{1}" md="{2}" lg="{3}">
						<TextInput
							labelText="City*"
							required
							name="city"
							placeholder="Los Angeles"
							invalid="{formElements.city.invalid}"
							invalidText="{formElements.city.invalidText}"
							bind:value="{client.city}"
						/>
					</Column>
					<Column sm="{1}" md="{2}" lg="{2}">
						<TextInput
							labelText="State*"
							required
							name="state"
							placeholder="Code: CA, NY etc"
							invalid="{formElements.state.invalid}"
							invalidText="{formElements.state.invalidText}"
							bind:value="{client.state}"
						/>
					</Column>
					<Column sm="{2}" md="{3}" lg="{3}">
						<TextInput labelText="Zip*" name="zip" placeholder="12345" bind:value="{client.zip}" />
					</Column>
					<Column sm="{2}" md="{3}" lg="{3}">
						<TextInput
							labelText="Country*"
							required
							name="country"
							placeholder="USA, UK etc"
							invalid="{formElements.country.invalid}"
							invalidText="{formElements.country.invalidText}"
							bind:value="{client.country}"
						/>
					</Column>
				</Row>
				<Row class="default-gap">
					<Column sm="{3}" md="{5}" lg="{10}">
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
			</FormGroup>
		</ModalBody>
		<ModalFooter>
			<Button kind="secondary" on:click="{onClose}" icon="{Close}">Cancel</Button>
			<Button kind="primary" type="submit" disabled="{!isValid}" icon="{formSubmitIcon}"
				>{formTitle}</Button
			>
		</ModalFooter>
	</form>
</ComposedModal>
