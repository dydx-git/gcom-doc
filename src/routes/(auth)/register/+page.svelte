<script lang="ts">
	import ColorButton from '$lib/components/ColorButton.svelte';
	import ColorGrid from '$lib/components/ColorGrid.svelte';
	import type { PageServerData } from './$types';
	import {
		TextInput,
		PasswordInput,
		Grid,
		Column,
		Row,
		Button,
		Select,
		SelectItem,
		FormLabel,
		StructuredList,
		StructuredListBody,
		StructuredListRow,
		StructuredListCell,
		StructuredListHead,
		StructuredListInput,
		InlineLoading
	} from 'carbon-components-svelte';
	import { UserRoleLabels } from '$lib/modules/auth/meta';
	import type { SalesRepColors } from '$lib/modules/sales-rep/meta';
	import { superForm } from 'sveltekit-superforms/client';
	import { schema } from './meta';
	import FormSubmissionError from '$lib/components/FormSubmissionError.svelte';
	import { CompanyLabel } from '$lib/modules/company/meta';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data: PageServerData;
	let submissionError: Error | null = null;

	const { form, errors, enhance, delayed } = superForm(data.form, {
		dataType: 'json',
		autoFocusOnError: 'detect',
		defaultValidator: 'clear',
		validators: schema,
		onResult: ({ result }) => {
			if (result.type !== 'failure') return;

			submissionError = result?.data?.error;
		}
	});

	const randomColor = '#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
	const colorTypes = Object.keys(getEmptyColorsObject());

	let color: string = randomColor,
		centerColor: string = randomColor,
		selected: number,
		selectedColorType: string = colorTypes[0];

	let reTypePassword = '';

	$: $form.salesRep.username = $form.auth.username;

	function getEmptyColorsObject(): SalesRepColors {
		return {
			primaryColor: '',
			secondaryColor: '',
			accentColor: '',
			auxiliaryColor: ''
		};
	}

	const handleColorInput = (e: Event) => {
		$form.colors = { ...$form.colors, ...getEmptyColorsObject() };
		const target = e.target as HTMLInputElement;
		centerColor = target.value;
		selected = 6;
	};

	const handleSwatchChange = (e: CustomEvent) => {
		color = e.detail.color;
		selected = e.detail.index;

		$form.colors[selectedColorType as keyof SalesRepColors] = color;
		// change the selected color type to the next one, or the first one if we're at the end
		const nextColorTypeIndex = colorTypes.indexOf(selectedColorType) + 1;
		if (nextColorTypeIndex < colorTypes.length) {
			selectedColorType = colorTypes[nextColorTypeIndex];
		} else {
			selectedColorType = colorTypes[0];
		}
	};
</script>

<SuperDebug data="{$errors}" />

<Grid>
	<h1>Register</h1>
	<FormSubmissionError error="{submissionError}" />
	<Row class="default-gap">
		<Column sm="{4}" md="{8}">
			<form method="POST" class="default-gap" use:enhance>
				<Row>
					<Column sm="{4}" md="{6}" lg="{5}">
						<TextInput
							autofocus
							id="username"
							name="username"
							labelText="Username*"
							bind:value="{$form.auth.username}"
							placeholder="jdoe1"
							helperText="Only letters and numbers allowed"
							invalid="{($errors?.auth?.username?.length ?? 0) > 0}"
							invalidText="{($errors?.auth?.username ?? [''])[0]}"
						/>
					</Column>
					<Column sm="{4}" md="{3}" lg="{5}">
						<PasswordInput
							labelText="Password*"
							name="password"
							placeholder="p@ssw0Rd1"
							invalid="{($errors?.auth?.password?.length ?? 0) > 0}"
							invalidText="{($errors?.auth?.password ?? [''])[0]}"
							bind:value="{$form.auth.password}"
						/>
					</Column>
					<Column sm="{4}" md="{3}" lg="{5}">
						<PasswordInput
							labelText="Retype Password"
							name="reTypePassword"
							placeholder="p@ssw0Rd1"
							invalid="{$form.auth.password !== reTypePassword}"
							bind:value="{reTypePassword}"
						/>
					</Column>
				</Row>
				<Row class="default-gap">
					<Column sm="{4}" md="{6}" lg="{5}">
						<TextInput
							name="name"
							labelText="Full Name*"
							bind:value="{$form.salesRep.name}"
							placeholder="John Doe"
							invalid="{($errors?.salesRep?.name?.length ?? 0) > 0}"
							invalidText="{($errors?.salesRep?.name ?? [''])[0]}"
						/>
					</Column>
					<Column sm="{4}" md="{3}" lg="{5}">
						<TextInput
							name="email"
							labelText="Email*"
							bind:value="{$form.salesRep.email}"
							invalid="{($errors?.salesRep?.email?.length ?? 0) > 0}"
							invalidText="{($errors?.salesRep?.email ?? [''])[0]}"
							placeholder="user@example.com"
						/>
					</Column>
					<Column sm="{4}" md="{3}" lg="{5}">
						<TextInput
							name="phone"
							labelText="Phone*"
							bind:value="{$form.salesRep.phone}"
							placeholder="(123) 456-7890"
							invalid="{($errors?.salesRep?.phone?.length ?? 0) > 0}"
							invalidText="{($errors?.salesRep?.phone ?? [''])[0]}"
						/>
					</Column>
				</Row>
				<Row class="default-gap">
					<Column sm="{4}" md="{3}" lg="{5}">
						<Select
							labelText="Company*"
							bind:selected="{$form.salesRep.companyId}"
							invalid="{($errors?.salesRep?.companyId?.length ?? 0) > 0}"
							invalidText="{($errors?.salesRep?.companyId ?? [''])[0]}"
						>
							<SelectItem value="0" text="Select company" />
							{#each Object.entries(CompanyLabel) as [key, value]}
								<SelectItem value="{key}" text="{value}" />
							{/each}
						</Select>
						<Select labelText="Role*" bind:selected="{$form.auth.role}" class="default-gap">
							{#each Object.entries(UserRoleLabels) as [key, value]}
								<SelectItem value="{key}" text="{value}" />
							{/each}
						</Select>
					</Column>
					<Row style="margin-left: 0px">
						<Column>
							<FormLabel textContent="Pick color">Color button</FormLabel>
							<div class="color" style:--color="{color}" style:--width="96px" style:--height="96px">
								<input type="color" bind:value="{color}" on:input="{handleColorInput}" />
								<ColorButton />
							</div>
						</Column>
						<Column>
							<ColorGrid
								centerColor="{centerColor}"
								selected="{selected}"
								on:colorChange="{handleSwatchChange}"
							/>
						</Column>
					</Row>
					<Column sm="{4}" md="{3}" lg="{4}">
						<FormLabel
							textContent="Pick color"
							style="{Object.keys($errors?.colors ?? {}) ? 'color: var(--cds-danger-02);' : ''}"
							>Selected colors</FormLabel
						>
						<StructuredList selection bind:selected="{selectedColorType}" condensed>
							<StructuredListHead>
								<StructuredListRow head>
									<StructuredListCell head>Color Type</StructuredListCell>
									<StructuredListCell head>Color</StructuredListCell>
								</StructuredListRow>
							</StructuredListHead>
							<StructuredListBody>
								{#each Object.entries($form.colors) as [key, color]}
									<StructuredListRow
										label
										for="row-{key}"
										class="{`row-${selectedColorType}` === `row-${key}` ? 'selected-row' : ''}"
										on:click="{() => (selectedColorType = `row-${key}`)}"
									>
										<StructuredListCell>{key}</StructuredListCell>
										<StructuredListCell>{color}</StructuredListCell>
										<StructuredListCell>
											<div
												class="color"
												style:--color="{color}"
												style:--width="14spx"
												style:--height="14px"
											>
												<input type="color" bind:value="{color}" disabled />
												<ColorButton />
											</div>
										</StructuredListCell>
										<StructuredListInput
											id="row-{key}"
											value="{key}"
											title="row-{key}-title"
											name="row-{key}-name"
										/>
									</StructuredListRow>
								{/each}
							</StructuredListBody>
						</StructuredList>
					</Column>
				</Row>
				{#if !$delayed}
					<Button type="submit" style="float: right; margin-right: 100px">Submit</Button>
				{:else}
					<InlineLoading status="active" description="Submitting" />
				{/if}
			</form>
		</Column>
	</Row>
</Grid>

<style>
	input[type='color'] {
		width: 96px;
		height: 96px;
		border: 0;
		padding: 0;
		background: transparent;
		position: absolute;
		opacity: 0;
	}
</style>
