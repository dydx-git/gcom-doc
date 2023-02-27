<script>
	import ColorButton from '$lib/components/ColorButton.svelte';
	import ColorGrid from '$lib/components/ColorGrid.svelte';
	import { HsvPicker } from 'svelte-color-picker';
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
		FormLabel
	} from 'carbon-components-svelte';

	let invalid = false;
	let user = {
		username: '',
		password: '',
		company: '',
		role: '',
		accentColor: '',
		secondaryColor: ''
	};

	$: invalid = !/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{6,}$/.test(user.password);
	let reTypePassword = '';
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
							minlength={3}
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
							minlength={3}
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
					<Column md={1} lg={5}>
						<FormLabel textContent="Pick color">Pick color*</FormLabel>
						<HsvPicker />
					</Column>
					<Row style="margin-left: 0px">
						<Column>
							<FormLabel textContent="Pick color">Selected color theme</FormLabel>
							<div style="height: 50px; width: 50px">
								<ColorButton />
							</div>
						</Column>
						<Column>
							<ColorGrid />
						</Column>
					</Row>
				</Row>
				<Button type="submit" style="float: right; margin-right: 100px" class="default-gap">
					Submit
				</Button>
			</Form>
		</Column>
	</Row>
</Grid>
