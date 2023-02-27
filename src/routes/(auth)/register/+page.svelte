<script lang="ts">
	import ColorButton from '$lib/components/ColorButton.svelte';
	import ColorGrid from '$lib/components/ColorGrid.svelte';
	import { CompanyLabel } from '$lib/models/client-form';
	import {
		TextInput,
		PasswordInput,
		Grid,
		Column,
		Row,
		Button,
		Form,
		Select,
		SelectItem,
		FormLabel,
		ListItem,
		UnorderedList
	} from 'carbon-components-svelte';

	let invalid = false;
	let user = {
		username: '',
		password: '',
		company: '',
		role: '',
		colors: [] as string[]
	};
	let color: string, centerColor: string, selected: number;
	let shake: boolean = false;

	$: invalid = !/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{6,}$/.test(user.password);
	let reTypePassword = '';

	const handleColorInput = (e: Event) => {
		user.colors = [];
		const target = e.target as HTMLInputElement;
		centerColor = target.value;
		selected = 6;
	};

	const handleSwatchChange = (e: CustomEvent) => {
		if (user.colors.length >= 5) return;

		color = e.detail.color;
		selected = e.detail.index;
		user.colors.push(color);
		user.colors = [...new Set(user.colors)];
	};
</script>

<Grid>
	<h1>Register</h1>
	<Row class="default-gap">
		<Column sm={4} md={8}>
			<Form method="POST" class="default-gap">
				<Row>
					<Column sm={4} md={6} lg={5}>
						<TextInput
							required
							id="username"
							name="username"
							labelText="Username*"
							bind:value={user.username}
							minlength={3}
							placeholder="John Doe"
						/>
					</Column>
					<Column sm={4} md={3} lg={5}>
						<PasswordInput
							labelText="Password"
							id="password"
							name="password"
							placeholder="Password*"
							{invalid}
							required
							minlength={6}
							bind:value={user.password}
						/>
					</Column>
					<Column sm={4} md={3} lg={5}>
						<PasswordInput
							labelText="Retype Password"
							id="reTypePassword"
							name="reTypePassword"
							placeholder="Password*"
							{invalid}
							required
							minlength={6}
							bind:value={reTypePassword}
						/>
					</Column>
				</Row>
				<Row>
					<Column sm={4} md={3} lg={5}>
						<Select required labelText="Company*" bind:selected={user.company}>
							{#each Object.entries(CompanyLabel) as [key, value]}
								<SelectItem value={key} text={value} />
							{/each}
						</Select>
					</Column>
					<Row style="margin-left: 0px">
						<Column>
							<FormLabel textContent="Pick color">Selected color theme</FormLabel>
							<div class="color" style:--color={color} style:--width="96px" style:--height="96px">
								<input type="color" bind:value={color} on:input={handleColorInput} />
								<ColorButton />
							</div>
						</Column>
						<Column>
							<ColorGrid {centerColor} {selected} on:colorChange={handleSwatchChange} />
						</Column>
					</Row>
					<Column sm={4} md={3} lg={4}>
						<FormLabel textContent="Pick color">Selected colors</FormLabel>
						<UnorderedList expressive>
							{#each user.colors as color}
								<ListItem style={`background-color: ${color}`}>{color}</ListItem>
							{/each}
						</UnorderedList>
						<p class:alert={user.colors.length >= 5}>
							Max 5 colors. Select a color from color button to clear currently selected colors
						</p>
					</Column>
				</Row>
				<Button type="submit" style="float: right; margin-right: 100px">Submit</Button>
			</Form>
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
