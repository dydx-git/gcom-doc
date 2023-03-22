<script lang="ts">
	import ColorButton from '$lib/components/ColorButton.svelte';
	import ColorGrid from '$lib/components/ColorGrid.svelte';
	import { CompanyLabel } from '$lib/modules/client/meta';
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
		ListItem,
		UnorderedList,
		StructuredList,
		StructuredListBody,
		StructuredListRow,
		StructuredListCell,
		StructuredListHead,
		StructuredListInput
	} from 'carbon-components-svelte';
	import { userPreferencesStore } from '$lib/store';
	import debounce from 'debounce';
	import { FormValidator } from '$lib/modules/validation/validation';
	import { UserRoleLabels } from '$lib/modules/auth/meta';
	import type { SalesRepColors } from '$lib/modules/sales-rep/meta';

	const userPreferences = $userPreferencesStore;

	let user = {
		username: '',
		password: '',
		companyId: Object.keys(CompanyLabel)[0],
		role: Object.keys(UserRoleLabels)[0],
		name: '',
		email: '',
		phone: '',
		colors: getEmptyColorsObject()
	};

	let errors: string[] = [];

	const formValidator = new FormValidator(user);
	$: formElementsStore = $formValidator.formElements;

	const randomColor = '#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
	const colorTypes = Object.keys(user.colors);

	let color: string = randomColor,
		centerColor: string = randomColor,
		selected: number,
		selectedColorType: string = colorTypes[0];

	let reTypePassword = '';

	function getEmptyColorsObject(): SalesRepColors {
		return {
			primaryColor: '',
			secondaryColor: '',
			accentColor: '',
			auxiliaryColor: ''
		};
	}

	function validateAllColorsPicked(colors: SalesRepColors) {
		const colorsList = Object.values(colors);

		return colorsList.every((color) => color !== '');
	}

	const handleColorInput = (e: Event) => {
		user.colors = getEmptyColorsObject();
		const target = e.target as HTMLInputElement;
		centerColor = target.value;
		selected = 6;
	};

	const handleSwatchChange = (e: CustomEvent) => {
		color = e.detail.color;
		selected = e.detail.index;

		user.colors[selectedColorType as keyof SalesRepColors] = color;
		// change the selected color type to the next one, or the first one if we're at the end
		const nextColorTypeIndex = colorTypes.indexOf(selectedColorType) + 1;
		if (nextColorTypeIndex < colorTypes.length) {
			selectedColorType = colorTypes[nextColorTypeIndex];
		} else {
			selectedColorType = colorTypes[0];
		}
	};

	const registerUser = async (e: Event) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const res = await fetch(form.action, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		});
		if (res.status === 200) {
			window.location.href = '/login';
		} else {
			const data = await res.json();
			errors = data.messages;
			console.log(errors);
		}
	};
</script>

<Grid>
	<h1>Register</h1>
	{#if errors.length > 0}
		<div style:margin-left="var(--cds-spacing-05)">
			<UnorderedList class="default-gap">
				{#each errors as error}
					<ListItem style="color: var(--cds-text-error)">{error}</ListItem>
				{/each}
			</UnorderedList>
		</div>
	{/if}
	<Row class="default-gap">
		<Column sm="{4}" md="{8}">
			<form
				method="POST"
				class="default-gap"
				on:submit|preventDefault="{registerUser}"
				on:input="{debounce($formValidator.validate, userPreferences.inputToProcessDelay)}"
			>
				<Row>
					<Column sm="{4}" md="{6}" lg="{5}">
						<TextInput
							autofocus
							required
							id="username"
							name="username"
							labelText="Username*"
							bind:value="{user.username}"
							minlength="{3}"
							pattern="^[a-zA-Z0-9]+$"
							placeholder="jdoe1"
							helperText="Only letters and numbers allowed"
							invalid="{formElementsStore.username.invalid}"
							invalidText="{formElementsStore.username.invalidText}"
						/>
					</Column>
					<Column sm="{4}" md="{3}" lg="{5}">
						<PasswordInput
							labelText="Password*"
							name="password"
							placeholder="p@ssw0Rd1"
							helperText="Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"
							pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$"
							invalid="{formElementsStore.password.invalid}"
							invalidText="{formElementsStore.password.invalidText}"
							required
							minlength="{6}"
							bind:value="{user.password}"
						/>
					</Column>
					<Column sm="{4}" md="{3}" lg="{5}">
						<PasswordInput
							labelText="Retype Password"
							name="reTypePassword"
							placeholder="p@ssw0Rd1"
							invalid="{reTypePassword !== user.password}"
							required
							bind:value="{reTypePassword}"
						/>
					</Column>
				</Row>
				<Row class="default-gap">
					<Column sm="{4}" md="{6}" lg="{5}">
						<TextInput
							required
							name="name"
							labelText="Full Name*"
							bind:value="{user.name}"
							placeholder="John Doe"
							invalid="{formElementsStore.name.invalid}"
							invalidText="{formElementsStore.name.invalidText}"
						/>
					</Column>
					<Column sm="{4}" md="{3}" lg="{5}">
						<TextInput
							required
							name="email"
							labelText="Email*"
							bind:value="{user.email}"
							pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
							placeholder="user@example.com"
						/>
					</Column>
					<Column sm="{4}" md="{3}" lg="{5}">
						<TextInput
							required
							name="phone"
							labelText="Phone*"
							bind:value="{user.phone}"
							pattern="[0-9\- ()]+"
							placeholder="(123) 456-7890"
							invalid="{formElementsStore.phone.invalid}"
							invalidText="{formElementsStore.phone.invalidText}"
						/>
					</Column>
				</Row>
				<Row class="default-gap">
					<Column sm="{4}" md="{3}" lg="{5}">
						<Select required labelText="Company*" bind:selected="{user.companyId}">
							{#each Object.entries(CompanyLabel) as [key, value]}
								<SelectItem value="{key}" text="{value}" />
							{/each}
						</Select>
						<Select required labelText="Role*" bind:selected="{user.role}" class="default-gap">
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
						<FormLabel textContent="Pick color">Selected colors</FormLabel>
						{#if !validateAllColorsPicked(user.colors)}
							<p class="alert">Please select all colors</p>
						{/if}
						<StructuredList selection bind:selected="{selectedColorType}" condensed>
							<StructuredListHead>
								<StructuredListRow head>
									<StructuredListCell head>Color Type</StructuredListCell>
									<StructuredListCell head>Color</StructuredListCell>
								</StructuredListRow>
							</StructuredListHead>
							<StructuredListBody>
								{#each Object.entries(user.colors) as [key, color]}
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
				<Button type="submit" style="float: right; margin-right: 100px">Submit</Button>
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

	.alert {
		color: red;
	}
</style>
