<script lang="ts">
	import ColorButton from '$lib/components/ColorButton.svelte';
	import ColorGrid from '$lib/components/ColorGrid.svelte';
	import type { PageData, PageServerData } from './$types';
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
	import { superForm } from 'sveltekit-superforms/client';

	const userPreferences = $userPreferencesStore;

	export let data: PageServerData;
	const { form, errors, enhance } = superForm(data.form, { dataType: 'json' });

	const randomColor = '#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
	const colorTypes = Object.keys(getEmptyColorsObject());

	let color: string = randomColor,
		centerColor: string = randomColor,
		selected: number,
		selectedColorType: string = colorTypes[0];

	let reTypePassword = '';
	let username = '';

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
		$form.colors = { salesRepUsername: username, ...getEmptyColorsObject() };
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

	$: console.log($form);

	const registerUser = async (e: Event) => {
		if (!validateAllColorsPicked($form.colors)) {
			return;
		}
		// const formElement = e.target as HTMLFormElement;
		// const res = await fetch(formElement.action, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify()
		// });
		// if (res.status === 200) {
		// 	window.location.href = '/login';
		// } else {
		// 	const data = await res.json();
		// 	console.log(errors);
		// }
	};
</script>

<Grid>
	<h1>Register</h1>
	<!-- {#if errors?.length > 0}
		<div style:margin-left="var(--cds-spacing-05)">
			<UnorderedList class="default-gap">
				{#each errors as error}
					<ListItem style="color: var(--cds-text-error)">{error}</ListItem>
				{/each}
			</UnorderedList>
		</div>
	{/if} -->
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
							required
							name="name"
							labelText="Full Name*"
							bind:value="{$form.salesRep.name}"
							placeholder="John Doe"
							invalid="{($errors?.salesRep?.length ?? 0) > 0}"
							invalidText="{($errors?.salesRep ?? [''])[0]}"
						/>
					</Column>
					<Column sm="{4}" md="{3}" lg="{5}">
						<TextInput
							name="email"
							labelText="Email*"
							bind:value="{$form.salesRep.email}"
							invalid="{($errors?.salesRep?.length ?? 0) > 0}"
							invalidText="{($errors?.salesRep ?? [''])[0]}"
							placeholder="user@example.com"
						/>
					</Column>
					<Column sm="{4}" md="{3}" lg="{5}">
						<TextInput
							name="phone"
							labelText="Phone*"
							bind:value="{$form.salesRep.phone}"
							placeholder="(123) 456-7890"
							invalid="{($errors?.salesRep?.length ?? 0) > 0}"
							invalidText="{($errors?.salesRep ?? [''])[0]}"
						/>
					</Column>
				</Row>
				<Row class="default-gap">
					<Column sm="{4}" md="{3}" lg="{5}">
						<Select required labelText="Company*" bind:selected="{$form.salesRep.companyId}">
							{#each Object.entries(CompanyLabel) as [key, value]}
								<SelectItem value="{key}" text="{value}" />
							{/each}
						</Select>
						<Select
							required
							labelText="Role*"
							bind:selected="{$form.auth.role}"
							class="default-gap"
						>
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
						{#if !validateAllColorsPicked($form.colors)}
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
