<script lang="ts">
	import clone from 'just-clone';
	import type { ActionData } from '.svelte-kit/types/src/routes/client/$types';
	import { Currency, EmailType, PayMethod, PhoneType, type Client } from '@prisma/client';
	import {
		Button,
		Checkbox,
		Column,
		ComposedModal,
		Form,
		FormGroup,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Row,
		Select,
		TextInput
	} from 'carbon-components-svelte';
	import { Add, Close, Edit, Subtract } from 'carbon-icons-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { Company, FormSubmitType, CompanyLabel, type ClientFormData } from '../core';
	import { clientFormDataStore, keepClientDataOnCloseStore } from './store';

	export let open = false;
	export let isValid = false;
	export let submitType: FormSubmitType;

	const getEmptyClient = (): ClientFormData => {
		const defaultValues = {
			id: null,
			name: '',
			companyName: '',
			phones: [
				{
					phone: '',
					type: PhoneType.PRIMARY,
					description: null
				}
			],
			emails: [
				{
					email: '',
					type: EmailType.JOB,
					description: null
				}
			],
			company: Company.ThreadTapes,
			notes: '',
			paymentMethod: PayMethod.UNKNOWN,
			currency: Currency.USD,
			addTransactionCharge: true,
			city: '',
			state: '',
			zip: '',
			address: '',
			country: ''
		};
		return clone(defaultValues);
	};

	export let client: ClientFormData = $keepClientDataOnCloseStore
		? $clientFormDataStore ?? getEmptyClient()
		: getEmptyClient();
	export let form: ActionData;

	$: if (form?.success) {
		open = false;
	}

	let formTitle = submitType === FormSubmitType.AddNew ? 'Create new' : 'Edit';
	let formSubmitIcon = submitType === FormSubmitType.AddNew ? Add : Edit;

	const onOpen = (e: Event) => {
		isValid = true;
	};
	const onClose = (e: Event) => {
		if ($keepClientDataOnCloseStore) {
			$clientFormDataStore = client;
		} else {
			$clientFormDataStore = null;
			client = getEmptyClient();
		}
	};
	const onSubmit = (e: Event) => {
		$keepClientDataOnCloseStore = false;
	};

	onMount(() => {});
	onDestroy(() => {});
</script>

<ComposedModal
	preventCloseOnClickOutside
	bind:open
	selectorPrimaryFocus="#name"
	on:open={onOpen}
	on:close={onClose}
	size="lg"
>
	<Form method="POST" on:submit={onSubmit}>
		<ModalHeader label={formTitle}>
			<Row>
				<Column sm={12} md={4} lg={8}>
					<h3>Client</h3>
				</Column>
				{#if submitType === FormSubmitType.AddNew}
					<Column sm={12} md={{ span: 3, offset: 1 }} lg={{ span: 4, offset: 4 }}>
						<Checkbox labelText="Keep input on close" bind:checked={$keepClientDataOnCloseStore} />
					</Column>
				{/if}
			</Row>
		</ModalHeader>
		<ModalBody hasForm>
			<input type="hidden" name="id" bind:value={client.id} />
			<Row>
				<Column sm={4} md={4} lg={8}>
					<TextInput
						required={true}
						id="name"
						name="name"
						labelText="Name*"
						bind:value={client.name}
						placeholder="John Doe"
					/>
				</Column>
				<Column sm={4} md={4} lg={8}>
					<TextInput
						labelText="Company"
						name="companyName"
						placeholder="Company Name"
						bind:value={client.companyName}
					/>
				</Column>
			</Row>
			<FormGroup class="default-gap">
				{#each client.phones as phone, i}
					<Row>
						<Column sm={2} md={3} lg={4}>
							<TextInput
								required={true}
								labelText="Phone*"
								name={`phones[${i}].phone`}
								placeholder="(xxx) xxx-xxxx"
								bind:value={phone.phone}
							/>
						</Column>
						<Column sm={2} md={2} lg={4}>
							<Select
								labelText="Type"
								name={`phones[${i}].type`}
								placeholder="(xxx) xxx-xxxx"
								bind:value={phone.type}
							>
								<option value={PhoneType.PRIMARY}>Primary</option>
								<option value={PhoneType.SECONDARY}>Secondary</option>
							</Select>
						</Column>
						<Column sm={0} md={2} lg={6}>
							<TextInput
								name={`phones[${i}].description`}
								placeholder="Personal phone etc."
								labelText="Description"
								bind:value={phone.description}
							/>
						</Column>
						<Column sm={0} md={1} lg={1}>
							<Button
								kind="tertiary"
								icon={Add}
								size="small"
								iconDescription="Add phone number"
								tooltipPosition="left"
								on:click={() => {
									client.phones = [
										...client.phones,
										{ phone: '', type: PhoneType.PRIMARY, description: '' }
									];
								}}
							/>
							<Button
								kind="danger-tertiary"
								icon={Subtract}
								size="small"
								iconDescription="Remove phone number"
								disabled={client.phones.length === 1}
								tooltipPosition="left"
								on:click={() => {
									client.phones = client.phones.filter((_, index) => index !== i);
								}}
							/>
						</Column>
					</Row>
				{/each}
			</FormGroup>
			<FormGroup class="default-gap">
				{#each client.emails as email, i}
					<Row>
						<Column sm={2} md={3} lg={4}>
							<TextInput
								labelText="Email*"
								required={true}
								name={`emails[${i}].email`}
								placeholder="john.doe@example.com"
								bind:value={email.email}
							/>
						</Column>
						<Column sm={2} md={2} lg={4}>
							<Select
								labelText="Type"
								name={`emails[${i}].type`}
								placeholder="Select email type"
								bind:value={email.type}
							>
								<option value={EmailType.JOB}>For orders</option>
								<option value={EmailType.INVOICE}>For invoices</option>
							</Select>
						</Column>
						<Column sm={0} md={2} lg={6}>
							<TextInput
								name={`emails[${i}].description`}
								placeholder="Description"
								labelText="Description"
								bind:value={email.description}
							/>
						</Column>
						<Column sm={0} md={1} lg={1}>
							<Button
								kind="tertiary"
								icon={Add}
								size="small"
								iconDescription="Add email"
								tooltipPosition="left"
								on:click={() => {
									client.emails = [
										...client.emails,
										{ email: '', type: EmailType.JOB, description: '' }
									];
								}}
							/>
							<Button
								kind="danger-tertiary"
								icon={Subtract}
								size="small"
								iconDescription="Remove email"
								tooltipPosition="left"
								disabled={client.emails.length === 1}
								on:click={() => {
									client.emails = client.emails.filter((_, index) => index !== i);
								}}
							/>
						</Column>
					</Row>
				{/each}
			</FormGroup>
			<Row class="default-gap">
				<Column sm={2} md={3} lg={6}>
					<Select
						required
						labelText="Company*"
						bind:value={client.company}
						placeholder="Thread Tapes, Buffalo etc."
					>
						{#each Object.entries(CompanyLabel) as [key, value]}
							<option value={key}>{value}</option>
						{/each}
					</Select>
				</Column>
				<Column sm={2} md={2} lg={6}>
					<Select labelText="Invoice Currency*" required />
				</Column>
				<Column sm={2} md={2} lg={4} class="default-gap">
					<Checkbox labelText="Add transaction charges*" bind:value={client.companyName} required />
				</Column>
			</Row>
		</ModalBody>
		<ModalFooter>
			<Button kind="secondary" on:click={onClose} icon={Close}>Cancel</Button>
			<Button kind="primary" type="submit" disabled={!isValid} icon={formSubmitIcon}
				>{formTitle}</Button
			>
		</ModalFooter>
	</Form>
</ComposedModal>
