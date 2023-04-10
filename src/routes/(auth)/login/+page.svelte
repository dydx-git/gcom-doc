<script>
	import {
		FluidForm,
		TextInput,
		PasswordInput,
		Grid,
		Column,
		Row,
		Button
	} from 'carbon-components-svelte';

	let password = '';
	let invalid = false;

	$: invalid = !/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{6,}$/.test(password);
</script>

<Grid>
	<h1>Login</h1>
	<Row class="default-gap">
		<Column sm="{4}" md="{{ span: 6, offset: 1 }}">
			<FluidForm method="POST">
				<TextInput
					labelText="User name"
					placeholder="Enter user name..."
					name="username"
					required
					width="100px"
				/>
				<PasswordInput
					bind:value="{password}"
					name="password"
					required
					size="sm"
					type="password"
					labelText="Password"
					placeholder="Enter password..."
				/>
				<Button type="submit" style="float: right;">Submit</Button>
			</FluidForm>
		</Column>
	</Row>
</Grid>
